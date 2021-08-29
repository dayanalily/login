import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Users } from '../models';
const axios = require('axios')
require('dotenv').config();

@injectable({scope: BindingScope.TRANSIENT})
export class NotificationsService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Envio de correo Electronico
   */

   SendMail(user: any){
    let payload = {
      from: {email: process.env.API_MAIL_FROM, name: process.env.API_MAIL_FROM_NAME},
      to: [{email: 'alex0195@gmail.com', name: 'Alex'}],
      subject: 'Creacion de Nuevo Usuario',
      html_part: `<h1>Se ha creado un nuevo usuario con las siguientes caracteristicas:</h1>
      <p>${user.username}</p>
      <p>${user.password}</p>
      <p>${user.role}</p>
      <p>${user.clientId}</p>`,
      //text_part: 'string',
      text_part_auto: true,
      //headers: {'X-CustomHeader': 'Header value'},
      //smtp_tags: ['string']
  }
  axios.post(process.env.API_MAIL,payload,{"headers": {
      "content-type": "application/json",
      "x-auth-token": process.env.API_MAIL_TOKEN
    }})
  .then((r: any) => {
      return r.data
  }).catch((e: any) => {
      return null
  })
   }

   async SendMailDocumentos(msj: any){
    let payload = {
      from: {email: process.env.API_MAIL_FROM, name: process.env.API_MAIL_FROM_NAME},
      to: [{email: process.env.API_MAIL_TO_DOCUMENTS, name: process.env.API_MAIL_TO_DOCUMENTS_NAME}],
      subject: 'Solicitud de Documentos',
      html_part: `<h1>Se ha generado la solicitud de Documentos:</h1>
      <p>${msj.solicitanteName}</p>
      <p>${msj.solicitanteFrom}</p>
      <p>${msj.solicitanteMsg}</p>`,
      //text_part: 'string',
      text_part_auto: true,
      //headers: {'X-CustomHeader': 'Header value'},
      //smtp_tags: ['string']
  }
  
  await axios.post(process.env.API_MAIL,payload,{"headers": {
      "content-type": "application/json",
      "x-auth-token": process.env.API_MAIL_TOKEN
    }})
  .then((r: any) => {
    return {status: 'success'}
  }).catch((e: any) => {
      return {status: 'error'}
  })
   }


}
