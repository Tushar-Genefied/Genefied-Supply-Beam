import { serverConfig } from "../config/enviroment";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export const getHash = async function (password: string) {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	return hashedPassword;
};

export const comparePassword = async function (reqPassword: string, hashedPassword: string) {
	if (!reqPassword || !hashedPassword) {
		return Promise.resolve(false);
	}
	return bcrypt.compare(reqPassword, hashedPassword);
};

export const getToken = function (data: any) {
	const token_secret = serverConfig.access_token_secrect;
	return jwt.sign(data, token_secret);
};

export const returnUniqueCode = function (type :string , data : any) {
    let array = [];
    try{
        if( type == 'single'){
            let uc = data;
            if( data.includes('http') || data.includes('https')){
                uc = data.split("?")[1];
            }
            array.push(uc);
        }else{
            for( let i =0 ;i <data.length ;i++){
                let uc = data[i];
                if( data[i].includes('https') || data[i].includes('http') ){
                    uc=data[i].split("?")[1];
                }
                array.push(uc);
            }
        }
        return array;

    }catch(error){
        console.log("error  return uniqueCode",error);
        return array;
    }
};

export const qrStatusObject : any= {
    '1' : 'qr_id',
    '2' : 'pqr_id',
    '3' : 'cqr_id'

}

export const trackingTypesObject : any= {
    '1' : 'IN',
    '2' : 'OUT',
    '3' : 'RETURN'
}

export const DMSStatus : any= {
	'0' : "DELETED",
    '1' : 'PENDING',
    '2' : 'REJECT',
    '3' : 'INPROGESS',
    '4' : 'PARTIALLY DISPATCH',
    '5' : 'FULLY DISPATCH',
    '6' : 'COMPLETE',
    
}