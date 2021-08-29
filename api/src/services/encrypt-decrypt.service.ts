const CryptoJS = require("crypto-js");
import { KeysService as keys} from './keys-service'
export class EncryptDecrypt{
type: string
    constructor(type:string){
        this.type = type
    }

    Ecrypt(text:string){
        switch (this.type) {
            case keys.MD5:
                return CryptoJS.MD5(text).toString()
                break;
        
            default:
                return 'This type crypt do not support'
                break;
        }
    }

}