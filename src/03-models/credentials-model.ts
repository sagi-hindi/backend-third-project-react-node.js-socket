import Joi from "joi";

class CredentialsModel{
    public username: string;
    public password: string;

    public constructor(credentials: CredentialsModel){
        this.username = credentials.username;
        this.password = credentials.password;

    }

    private static loginSchema = Joi.object({
        username: Joi.string().required().min(2).max(30),
        password: Joi.string().required().min(2).max(30),

   });

   public validateLogin():string{
       const result = CredentialsModel.loginSchema.validate(this);

       return result.error?.message;

   };
}

export default CredentialsModel