import { NextFunction, Request, Response } from "express";
import ErrorModel from "../03-models/error-model";
import cyber from "../01-utils/cyber";


async function verifyLoggedIn(req:Request, res:Response, next:NextFunction):Promise<void>{

    const authorizationHeader = req.header("authorization");

    const isValid = await cyber.verifyToken(authorizationHeader)
    
    if(!isValid){
        next(new ErrorModel(401, "you are not logged in"));
        return;

    }
    next();



}

export default verifyLoggedIn