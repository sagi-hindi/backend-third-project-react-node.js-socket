import { NextFunction, Request, Response } from "express";


function preventGarbage(req:Request, res:Response, next:NextFunction):void{
    for(const prop in req.body){
        if(typeof req.body[prop] === "string" && req.body[prop].length > 500 ){
            next({ status: 400, message:"Data is to long....."})
            return;
        }
    }
    next();
}

export default preventGarbage;