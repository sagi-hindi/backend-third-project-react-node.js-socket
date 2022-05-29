import jwt from "jsonwebtoken"
import UserModel from "../03-models/user-model";
import crypto from "crypto";
import jwtDecode from "jwt-decode"

const salt = "MakeThingsGoRight" 

//hash password:
function hash(plainText: string):string{

    if(!plainText) return null;

    const hashedText = crypto.createHmac("sha512", salt).update(plainText).digest("hex") // hex ----> convert to string 

    return hashedText;
}


const secretKey = "KittensAreCute";

function getNewToken(user:UserModel):string{
    const payload = { user };
    
    const token = jwt.sign(payload, secretKey, {expiresIn: "1d"})

    return token

};

function verifyToken(authorizationHeader:string):Promise<boolean>{

    return new Promise((resolve, reject) => {

        if(!authorizationHeader){
            resolve(false);
            return;
        };
        
        const token = authorizationHeader.split(" ")[1];

        if(!token){
            resolve(false);
            return;
        }
        

        jwt.verify(token, secretKey, (err) => {
            
            if(err){
                resolve(false);
                return;
            }

            resolve(true);
        });

    });

};
function getUserFromToken(authorizationHeader:string):UserModel{

    const token = authorizationHeader.split(" ")[1];

    const payload: any = jwt.decode(token);
    const user = payload.user;

    return user;

};

function extractUserId(authorizationHeader: string): string {

    // If there is no authorization header: 
    if(!authorizationHeader) {
        console.log("no header");
        return null;
    }

    // Extract the token ("Bearer given-token"): 
    const token = authorizationHeader.split(" ")[1];

    // If there is no token: 
    if(!token) {
        console.log("no token");
        return null;
    }

    // Here we have a token: 
    const encodedObject: any = jwtDecode(token);
    return encodedObject.user.userId;
}




export default {
    getNewToken,
    verifyToken,
    getUserFromToken,
    hash,
    extractUserId
}


