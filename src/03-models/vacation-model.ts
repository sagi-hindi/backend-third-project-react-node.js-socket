import Joi from "joi";
import { UploadedFile } from 'express-fileupload';



class VacationModel{
    public vacationId:number;
    public description:string;
    public destination:string;
    public imageName:string;
    public startDate:string;
    public endDate:string;
    public price:number;
    public image:UploadedFile;
    public isFollow:boolean;
    public sumOfFollowers:number;

    constructor(vacation:VacationModel){
        this.vacationId = vacation.vacationId;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.imageName = vacation.imageName;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.image = vacation.image
        this.isFollow=vacation.isFollow;
        this.sumOfFollowers=vacation.sumOfFollowers;
        

    }
    private static postSchema = Joi.object({
        vacationId: Joi.string().forbidden(),
        description: Joi.string().required().min(2).max(500),
        destination: Joi.string().required().min(2).max(30),
        imageName: Joi.string().optional(),
        startDate: Joi.string().optional().min(2).max(30),
        endDate: Joi.string().optional().min(2).max(30),
        price: Joi.number().required().min(1),
        image: Joi.object().optional(),
        isFollow:Joi.boolean().optional(),
        sumOfFollowers:Joi.number().optional()
        

   });

   private static putSchema = Joi.object({
    vacationId: Joi.number().required().integer().min(1),
    description: Joi.string().required().min(2).max(500),
    destination: Joi.string().required().min(0).max(30),
    imageName: Joi.string().optional(),
    startDate: Joi.string().optional().min(2).max(30),
    endDate: Joi.string().optional().min(2).max(30),
    price: Joi.number().required().min(1),
    image: Joi.object().optional(),
    isFollow:Joi.boolean().optional(),
    sumOfFollowers:Joi.number().optional()


});

   public validatePost():string{
       const result = VacationModel.postSchema.validate(this);

       return result.error?.message;

   };

   
   public validatePut():string{
    const result = VacationModel.putSchema.validate(this);

    return result.error?.message;

};



}

export default VacationModel