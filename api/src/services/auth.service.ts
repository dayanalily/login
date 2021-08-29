import { repository } from "@loopback/repository";
import { Users } from "../models";
import { UsersRepository } from "../repositories";
import { EncryptDecrypt } from "./encrypt-decrypt.service";
import { KeysService } from "./keys-service";
const jwt = require('jsonwebtoken')

import {injectable, /* inject, */ BindingScope} from '@loopback/core';
@injectable({scope: BindingScope.TRANSIENT})

export class AuthService{
    constructor(
        @repository(UsersRepository)
        public usersRepository : UsersRepository,
    ){

    }
    async Indentify(run: string, password: string): Promise<Users | false>{
        let user = await this.usersRepository.findOne({where: {run, active: true}})
        if(user){
            let cryptPass = new EncryptDecrypt(KeysService.LOGIN).Ecrypt(password)
            if(user.password == cryptPass){
                return user
            }
        }
        return false
    }

    async RenewToken(id: string): Promise<Users | false>{
        let user = await this.usersRepository.findById(id)
        if(user){
            return user
        }
        return false
    }

    GenerateToken(user:Users){
        user.password = ''
        let token = jwt.sign({
            exp: KeysService.TOKEN_EXP,
            data:{
                id: user.id,
                role: user.role
            }
        }, KeysService.JWT_SECRET)
        return token
    }

    VerifyJWT(token: string){
        try{
            let decoded = jwt.verify(token,KeysService.JWT_SECRET)
            return decoded
        }catch {
            return null
        }
        
    }

    Md5(text:string){
        return new EncryptDecrypt(KeysService.LOGIN).Ecrypt(text)
    }
    
}