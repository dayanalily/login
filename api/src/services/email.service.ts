//import Utils from '../utils';
import { BindingScope, injectable } from '@loopback/core';
import * as nodemailer from 'nodemailer';
//import { IEmail } from '../type-schema';

export interface EmailManager<T = Object> {
  sendMail(): Promise<T>;
}

@injectable({ scope: BindingScope.TRANSIENT })
export class EmailService {
  MAIL_ADDRESS: string = process.env.EMAIL || ''

  constructor() { }

  async sendMail(to: any, subject: any, html: any): Promise<object> {
    let transporter = nodemailer.createTransport(
      {
        "host": 'vps-2148228-x.dattaweb.com',
        "secure": true,
        "port": 465,
        "tls": {
          "rejectUnauthorized": false
        },
        "auth": {
          user: 'no-reply@bodegalibre.cl',
          pass: '6p1lNlawpd'
        }
      });
    try {
      return await transporter.sendMail({
        from: "no-reply@bodegalibre.cl",
        to: to,// ["dayanalily22@gmail.com", "andreaganes@gmail.com"],
        subject: subject,//"Bienvenido a Bodega Libre",
        html: html// "Te amo mi niña Hermosa ahora si puedo decir Feliz 18 ajajaajaja"
      });
    }
    catch (e) {
      console.log('eerror email')
      console.log(e)
      console.log('/eerror email')
      return e
    }



    // async sendMail(mailObj: IEmail): Promise<object> {
    // const configOption = Utils.getSiteOptions();

    // let transporter = nodemailer.createTransport(configOption.email);

    // return await transporter.sendMail();
  }
}
