import { VACATION_SOCKET_EVENTS } from './01-utils/enums';
import cors from "cors";
import dotenv from 'dotenv';
import express from "express"
import vacationsController from "./04-controllers/vacations-controller"
import authController from "./04-controllers/auth-controllers"
import fileUpload from "express-fileupload";
import errorsHandler from "./02-middleware/errors-handler";
import {NextFunction, Request, Response } from "express";
import ErrorModel from "./03-models/error-model";
import preventGarbage from "./02-middleware/prevent-garbage";
import followController from "./04-controllers/follow-controller";
import path from 'path';
import process from "process";
import config from "./01-utils/config";
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config();

const app = express();
  
app.use(cors());
app.use(express.json());
app.use(preventGarbage);
app.use(fileUpload());

const frontendDir = path.join(__dirname, 'frontend'); 
app.use(express.static(frontendDir)) 


app.use("/api", vacationsController)
app.use("/api", authController)
app.use("/api", followController)

app.use("*", (request: Request, response: Response, next: NextFunction) => {
    if (config.isDevelopment) {
        next(new ErrorModel(404, "Route not found."));
    }
    else { 
        const indexHtmlFile = path.join(__dirname, "frontend", "index.html");
        response.sendFile(indexHtmlFile);
    }
});

app.use(errorsHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000"  }});

io.on("connection", (socket) => {
    app.set("io", io);
    console.log("Client has connected...");

    socket.on("disconnect", () => {
        console.log("Client has been disconnect");
    });
  });


httpServer.listen(process.env.PORT,()=>console.log(`Listening on port ${process.env.PORT}...`));


