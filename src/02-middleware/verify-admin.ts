import { NextFunction, Request, Response } from "express";
import ErrorModel from "../03-models/error-model";
import roleModel from "../03-models/role-model";
import cyber from "../01-utils/cyber";


async function verifyAdmin(req:Request, res:Response, next:NextFunction):Promise<void>{

    const authorizationHeader = req.header("authorization");

    const isValid = await cyber.verifyToken(authorizationHeader)
    
    if(!isValid){
        next(new ErrorModel(401, "you are not logged in"));
        return;

    }
    const user = cyber.getUserFromToken(authorizationHeader)

    if(user.role !== roleModel.Admin){
        next(new ErrorModel(403, "you are not authorized"));
        return;

    }
    
    next();

}

export default verifyAdmin