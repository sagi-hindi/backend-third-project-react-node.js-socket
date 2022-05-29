import { OkPacket } from "mysql";
import cyber from "../01-utils/cyber";
import CredentialsModel from "../03-models/credentials-model";
import ErrorModel from "../03-models/error-model";
import UserModel from "../03-models/user-model";
import dal from "../06-dal/dal"
import {v4 as uuid} from "uuid"
import RoleModel from "../03-models/role-model";

async function register(user:UserModel):Promise<string>{

    // Validation:
    const errors = user.validateRegister()
    if(errors) throw new ErrorModel(400,errors);

    const isTaken = await isUsernameTaken(user.username);
     
    if(isTaken){
        throw new ErrorModel(400, `Username ${user.username} already exists`);
    }
    user.role = RoleModel.User;
    user.password = cyber.hash(user.password);
    
    // create new uuid
    // user.userId = uuid()

    const sql = `INSERT INTO users VALUES(DEFAULT,?,?,?,?,?)`;
    const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password,user.role]);
    user.userId = info.insertId
    delete user.password 

    const token = cyber.getNewToken(user);

    return token;
}

async function login(credentials:CredentialsModel):Promise<string>{

    const errors = credentials.validateLogin();

    if(errors) throw new ErrorModel(400,errors);

    //hash password
    credentials.password = cyber.hash(credentials.password);

    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const users = await dal.execute(sql, [credentials.username, credentials.password]);
    

    if(users.length === 0){
        throw new ErrorModel(401,`Incorrect username or password`)
    }

    const user = new UserModel(users[0])
    delete user.password 
    const token = cyber.getNewToken(user);

    return token;
}

async function isUsernameTaken(username:string):Promise<boolean>{
    const sql = `SELECT COUNT(*) AS count FROM Users WHERE username = ?`;
    const table = await dal.execute(sql, [username]);
    const row = table[0];
    const count = row.count
    return count > 0

}

export default {
    register,
    login
}