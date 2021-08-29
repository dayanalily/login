import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, oas, param, patch, post, put, Request, requestBody,
  response, Response, RestBindings
} from '@loopback/rest';
import multer from 'multer';
import stream from 'stream';
import {Users} from '../models';
import {UsersRepository} from '../repositories';
import {AuthService} from '../services/auth.service';

class Credentials {
  run: string
  password: string
}

const AWS = require('aws-sdk');
const {Duplex} = stream;
function bufferToStream(buffer: any) {
  const duplexStream = new Duplex();
  duplexStream.push(buffer);
  duplexStream.push(null);
  return duplexStream;
}

@authenticate('jwt')
export class UsersController {
  authServices: AuthService
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {
    this.authServices = new AuthService(usersRepository)
  }

  @authenticate.skip()
  @post('/users')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    users: Omit<Users, 'id'>,
  ): Promise<Users> {
    return this.usersRepository.create(users);
  }

  @get('/users/count')
  @response(200, {
    description: 'Users model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Users) filter?: Filter<Users>,
  ): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'Users PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Users, {exclude: 'where'}) filter?: FilterExcludingWhere<Users>
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'Users PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'Users PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }

  @get('/users/resetpassword/{id}')
  @response(204, {
    description: 'Users Reset Password success',
  })
  async resetPassword(@param.path.string('id') id: string): Promise<void> {
    const usr = await this.usersRepository.findById(id)
    if (usr) {
      const password = this.authServices.Md5(usr.run)
      await this.usersRepository.updateById(id, {password});
    } else {
      throw new HttpErrors[400]('Request not valid')
    }
  }

  @authenticate.skip()
  @post('/login')
  @response(200, {
    description: 'Login for users',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async login(
    @requestBody() credentials: Credentials
  ): Promise<Object> {
    try {
      const user = await this.authServices.Indentify(credentials.run, credentials.password)
      if (user) {
        const tk = await this.authServices.GenerateToken(user)
        return {
          data: user,
          token: tk
        }
      } else {
        throw new HttpErrors[401]('User or Password invalid.')
      }
    } catch (error) {
      throw new HttpErrors[401]('User or Password invalid.')
    }
  }

  @authenticate.skip()
  @post('/renewtoken/{id}')
  @response(200, {
    description: 'Renew token for users',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async renovarToken(
    @param.path.string('id') id: string,
  ): Promise<Object> {
    const user = await this.authServices.RenewToken(id)
    if (user) {
      const tk = await this.authServices.GenerateToken(user)
      return {
        data: user,
        token: tk
      }
    } else {
      throw new HttpErrors[403]('Request not valid')
    }
  }

  @authenticate.skip()
  @get('/encriptar/{id}')
  @response(200, {
    description: 'Renew token for users',
  })
  async encriptar(
    @param.path.string('id') id: string,
  ): Promise<any> {
    return this.authServices.Md5(id)
  }

  @post('/users/addphoto/{id}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: '',
      },
    },
  })
  async adjuntarFoto(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('id') id: string,
  ): Promise<object> {
    const config = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      endpoint: process.env.S3_ENDPOINT,
    };
    const s3 = new AWS.S3(config);
    return new Promise<object>(async (resolve, reject) => {
      const storage = multer.memoryStorage();
      const upload = multer({storage});
      const usr = await this.usersRepository.findById(id);
      if (!usr) throw new HttpErrors[404]('User not found')

      upload.any()(request, response, async (err: any) => {
        if (err) reject(err);
        else {
          const res = [];
          for (const file of (request as any).files) {
            const ext = file.originalname.slice((file.originalname.lastIndexOf(".") - 1 >>> 0) + 2)
            const params = {
              Bucket: 'smartraining-visorrecursos/users',
              Key: new Date().getTime() + '.' + ext,
              Body: bufferToStream(file.buffer),
            };
            try {
              const stored = await s3.upload(params).promise();
              res.push(stored);
              usr.photo = stored.key
              usr.photomimetype = file.mimetype
              this.usersRepository.updateById(id, usr);
            } catch (err) {
              reject(err);
            }
          }
          resolve(res);
        }
      });
    });
  }
  @get('/users/photo/{id}')
  @oas.response.file()
  async descargarDocumento(
    @param.path.string('id') id: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    const config = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      endpoint: process.env.S3_ENDPOINT,
    };
    const usr = await this.usersRepository.findById(id);
    if (usr.photo && usr.photomimetype) {
      const type = usr.photomimetype ? usr.photomimetype : 'image/jpeg'
      const s3 = new AWS.S3(config);
      return new Promise<object>(async (resolve, reject) => {
        const params = {
          Bucket: 'smartraining-visorrecurso',
          Key: usr.photo,
        };
        s3.getObject(params)
          .promise()
          .then(function (file: any) {
            resolve(
              response
                .status(200)
                .contentType(type)
                .send(file.Body),
            );
          })
          .catch(function (err: any) {
            reject(err);
          });
      });
    } else {
      throw new HttpErrors[404]('La imagen solicitada no existe en la bdd')

    }
  }


}
