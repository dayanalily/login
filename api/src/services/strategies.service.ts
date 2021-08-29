import { AuthenticationStrategy } from '@loopback/authentication'
import { repository } from '@loopback/repository';
import { HttpErrors, Request } from '@loopback/rest'
import { UserProfile } from '@loopback/security'
import parseBearerToken from 'parse-bearer-token'
import { AuthService } from './auth.service'
import {UsersRepository} from '../repositories';

export class AutoriceJwt implements AuthenticationStrategy{
    name: string = 'jwt'
    authServices: AuthService
    constructor(
        @repository(UsersRepository)
        public usersRepository: UsersRepository,
    ){
        this.authServices = new AuthService(usersRepository)
    }

    async authenticate(request: Request): Promise <UserProfile | undefined> {
        const token = parseBearerToken(request)
        if (!token) {
            throw new HttpErrors[401]('Token not found')
        }
        let datos = this.authServices.VerifyJWT(token)
        if(datos){
            let perfil: UserProfile = Object.assign({
                id: datos.data.id,
                username: datos.data.username,
                role: datos.data.role
            })
            return perfil
        }else{
            throw new HttpErrors[401]('Token not valid')
        }
        
    }
}