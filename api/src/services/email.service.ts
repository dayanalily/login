import { /* inject, */ BindingScope, injectable} from '@loopback/core';

import Mail = require('nodemailer/lib/mailer');
const nodemailer = require("nodemailer");


@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */


}
