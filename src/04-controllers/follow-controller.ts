import express, { NextFunction, Request, Response } from "express";
import cyber from "../01-utils/cyber";
import verifyLoggedIn from "../02-middleware/verify-loggin";
import followersLogic from "../05-logic/followers-logic";

const router = express.Router();

router.get("/reports/vacations", async (request:Request, response:Response, next:NextFunction)=>{
    try{
        const NumberOfFollowers = await followersLogic.getNumberOfFollowers();
        console.log(NumberOfFollowers)
        response.json(NumberOfFollowers)
    }
    catch(err:any){
        next(err)
    }
});


router.post("/vacations/add-follow/:id", verifyLoggedIn, async (request:Request, response:Response, next:NextFunction)=>{
    try{
        const userId = +cyber.extractUserId(request.headers.authorization);
        const vacationId = +request.params.id
        const newFollow = await followersLogic.addFollow(userId, vacationId);
        response.json(newFollow)
    }
    catch(err:any){
        next(err)
    }
});

router.delete("/vacations/remove-follow/:id", verifyLoggedIn, async (request:Request, response:Response, next:NextFunction)=>{
    try{
        const userId = +cyber.extractUserId(request.headers.authorization);
        const vacationId = +request.params.id
        const removeFollow = await followersLogic.RemoveFollow(userId, vacationId);
        response.json(removeFollow)
    }
    catch(err:any){
        next(err)
    }
});



export default router