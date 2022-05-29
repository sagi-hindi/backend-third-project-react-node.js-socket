import { OkPacket } from 'mysql';
import ErrorModel from "../03-models/error-model";
import VacationModel from "../03-models/vacation-model";
import dal from "../06-dal/dal";
import { v4 as uuid } from "uuid";

async function getAllVacationsNew():Promise<VacationModel[]>{
    const sql = `SELECT * from Vacations;`;

    const vacations = await dal.execute(sql,);

    for (let i in vacations) {
        if (vacations[i].isFollow !== null) {
            vacations[i].isFollow = true;
        } else {
            vacations[i].isFollow = false;
        }
    }

return vacations;

};



async function getAllVacations(userId:string):Promise<VacationModel[]>{
    const sql = `SELECT vacations.vacationId, description, destination, imageName, startDate, endDate, price, followers.userId AS isFollow FROM vacations 
    LEFT JOIN followers
    ON vacations.vacationId = followers.vacationId 
    && followers.userId = ?
    ORDER BY followers.userId DESC;`;

    const vacations = await dal.execute(sql, [userId]);

    for (let i in vacations) {
        if (vacations[i].isFollow !== null) {
            vacations[i].isFollow = true;
        } else {
            vacations[i].isFollow = false;
        }
    }

return vacations;

};

async function getOneVacation(id:number):Promise<VacationModel>{
    const sql = `SELECT * FROM vacations WHERE vacationId = ?`;

    const vacation = await dal.execute(sql, [id]);

return vacation;

};


async function addOneVacation(vacation: VacationModel): Promise<VacationModel> {

    const error = vacation.validatePost();
    if (error) {
        throw new ErrorModel(400, error);
    }

    if (vacation.image) {
        const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf(".")); // the original extension (e.g. ".jpg")
        vacation.imageName = uuid() + extension; 
        await vacation.image.mv("./src/assets/images/" + vacation.imageName); // Save the image to the disk.
        delete vacation.image; // Delete the image before returning the model to the front.
    }
    const sql = "INSERT INTO vacations VALUES (?,?,?,?,?,?,?)";

    const addedVacation: OkPacket = await dal.execute(sql, [vacation.vacationId, vacation.description, vacation.destination, vacation.imageName, vacation.startDate, vacation.endDate, vacation.price]);
    vacation.vacationId = addedVacation.insertId
    
    return vacation;
}
async function deleteOneVacations(id:number):Promise<void>{
    const sql = `DELETE FROM Vacations WHERE vacationId = ?`;

    const info:OkPacket = await dal.execute(sql, [id]);
    
    if(info.affectedRows === 0) throw new ErrorModel(404, `id ${id} not found`)

}

async function updateFullVacation(vacation:VacationModel):Promise<VacationModel>{

    const errors = vacation.validatePut()
    if(errors) throw new ErrorModel(400,errors);

        const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf(".")); 
        vacation.imageName = uuid() + extension; 
        await vacation.image.mv("./src/assets/images/" + vacation.imageName); 
        delete vacation.image; 

    const sql = `UPDATE Vacations SET 
                description = ?,
                destination = ?,
                imageName = ?,
                startDate = ?,
                endDate = ?,
                price = ?
                WHERE vacationId = ?`;

    const info: OkPacket = await dal.execute(sql, [vacation.description, vacation.destination, 
        vacation.imageName, vacation.startDate, vacation.endDate, vacation.price, vacation.vacationId]);

    if(info.affectedRows === 0) throw new ErrorModel(404, `id ${vacation.vacationId} not found`)

    return vacation;

};







 export default {
    getAllVacations,
    getOneVacation,
    addOneVacation,
    deleteOneVacations,
    updateFullVacation,
    getAllVacationsNew
}