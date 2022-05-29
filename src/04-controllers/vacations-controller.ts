import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cyber from "../01-utils/cyber";
import { VACATION_SOCKET_EVENTS } from "../01-utils/enums";
import verifyAdmin from "../02-middleware/verify-admin";
import verifyLoggedIn from "../02-middleware/verify-loggin";
import VacationModel from "../03-models/vacation-model";
import vacationLogic from "../05-logic/vacation-logic";

const router = express.Router();


router.get("/vacations", verifyLoggedIn, async (request:Request, response:Response, next:NextFunction)=>{
    try{
        const userId = cyber.extractUserId(request.headers.authorization);
        const vacations = await vacationLogic.getAllVacations(userId);
        response.json(vacations)
    }
    catch(err:any){
        next(err)
    }
});

router.get("/vacations/:id", verifyAdmin, async (request:Request, response:Response, next:NextFunction)=>{
    try{
        const id = +request.params.id
        const vacation = await vacationLogic.getOneVacation(id);
        response.json(vacation)
    }
    catch(err:any){
        next(err)
    }
});

router.post("/vacations/add-vacation", verifyAdmin, async (request:Request, response:Response, next:NextFunction)=>{
    try{
       
        request.body.image = request.files?.image
        const userId = cyber.extractUserId(request.headers.authorization);
        const vacation = new VacationModel(request.body)
        const addedVacation = await vacationLogic.addOneVacation(vacation);
        const io = request.app.get("io");
        io.sockets.emit('vacation_created', addedVacation)
        response.json(addedVacation)
    }
    catch(err:any){
        next(err)
    }
});

router.get("/vacations/images/:imageName", async (request:Request, response:Response, next:NextFunction) =>{
    try{
        const imageName = request.params.imageName
        const absolutePath = path.join(__dirname, "..", "assets", "images", imageName);
        response.sendFile(absolutePath)
    
    }
    catch(err:any){
        next(err)
    }
})

router.delete("/vacations/:id", verifyAdmin, async (request:Request, response:Response, next:NextFunction)=>{
    try{
        const id = +request.params.id;
        await vacationLogic.deleteOneVacations(id);
        const io = request.app.get("io");
        io.sockets.emit('vacation_deleted', id)
        response.sendStatus(204);
        
   
    }

    catch(err:any){
        next(err);

    }
    
});

router.put("/vacations/:id", verifyAdmin, async (request:Request, response:Response, next:NextFunction)=>{
    try{
        const id = +request.params.id;
        request.body.vacationId = id;
        request.body.image = request.files?.image
        const vacation = new VacationModel(request.body);
        const updatedVacation = await vacationLogic.updateFullVacation(vacation);
        const io = request.app.get("io");
        io.sockets.emit('vacation_updated', updatedVacation)
        response.json(updatedVacation)
   
    }

    catch(err:any){
        next(err);

    }

});


export default router



'CREATE'
'UPDATE'
'DELETE'