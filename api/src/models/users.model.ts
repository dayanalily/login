import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
  })
  nombreComercial: string;

  @property({
    type: 'string',
    required: false,
  })
  razonSocial: string;

  @property({
    type: 'string',
    required: false,
  })
  rubro: string;

  @property({
    type: 'string',
    required: false,
  })
  nombres: string;
  
  @property({
    type: 'string',
    required: false,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: false,
  })
  email: string;

  @property({
    type: 'string',
    required: false,
  })
  mailRecuperacion: string;

  @property({
    type: 'string',
    required: false,
  })
  rut: string;

  @property({
    type: 'string',
    required: false,
  })
  tlfPpal: string;

  @property({
    type: 'string',
    required: false,
  })
  tlfAlternativo: string;


  @property({
    type: 'string',
    required: false,
  })
  tlfFijo: string;

  @property({
    type: 'string',
    required: false,
  })
  profesion: string;

  @property({
    type: 'string',
    required: false,
  })
  cargo: string;

  @property({
    type: 'string',
    required: false,
  })
  pais: string;

  @property({
    type: 'string',
    required: false,
  })
  region: string;

  @property({
    type: 'string',
    required: false,
  })
  comuna: string;

  @property({
    type: 'string',
    required: false,
  })
  ciudad: string;

  @property({
    type: 'string',
    required: false,
  })
  calle: string;

  @property({
    type: 'string',
    required: false,
  })
  numero: string;

  @property({
    type: 'string',
    required: false,
  })
  depto: string;

  @property({
    type: 'string',
    required: false,
  })
  codigoPostal: string;

  @property({
    type: 'string',
    required: false,
  })
  password: string;
  @property({
    type: 'object',
    required: false,
  })
  asociados?: object;   //asicados son los socios de persona juridica

  @property({
    type: 'boolean',
    default: true,
  })
  create?: string;

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
