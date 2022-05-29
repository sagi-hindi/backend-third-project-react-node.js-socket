import Joi from "joi"
import RoleModel from "./role-model";

class UserModel{
    public userId: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public role: RoleModel;

    constructor(user:UserModel){
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }
    
    private static registerSchema = Joi.object({
        userId: Joi.number().forbidden(),
        firstName: Joi.string().required().min(2).max(30),
        lastName: Joi.string().required().min(2).max(30),
        username: Joi.string().required().min(2).max(30),
        password: Joi.string().required().min(2).max(30),
        role: Joi.forbidden(),

   });

   public validateRegister():string{
       const result = UserModel.registerSchema.validate(this);

       return result.error?.message;

   };

}

export default UserModel