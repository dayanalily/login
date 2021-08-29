import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  run: string;

  @property({
    type: 'string',
    required: true,
  })
  fatherName: string;

  @property({
    type: 'string',
  })
  motherName?: string;

  @property({
    type: 'string',
  })
  businessName?: string; // razon social

  @property({
    type: 'string',
    required: true,
  })
  gender: string; // sexo

  // desde aca
  @property({
    type: 'string',
  })
  fhoto?: string;

  @property({
    type: 'string',
  })
  role?: string;

  @property({
    type: 'object',
  })
  asociados?: object;   //asicados son los socios de persona juridica

  @property({
    type: 'string',
  })
  password?: string;


  @property({
    type: 'string',
  })
  photo?: string;


  @property({
    type: 'boolean',
    default: false,

  })
  verified?: boolean;



  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  active?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
