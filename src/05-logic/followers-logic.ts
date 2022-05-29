import { OkPacket } from 'mysql';
import dal from "../06-dal/dal";


async function getNumberOfFollowers():Promise<void>{
    const sql = `SELECT vacations.vacationId, vacations.destination,
    (SELECT COUNT(*) FROM followers WHERE vacationId = vacations.vacationId) AS sumOfFollowers
    FROM vacations
    LEFT JOIN followers
    ON vacations.vacationId = followers.vacationId
    GROUP BY vacations.vacationId;`;

    const info = await dal.execute(sql);
    return info

};


async function addFollow(userId:number, vacationsId:number):Promise<void>{
    const sqlNew = `INSERT INTO Followers VALUES (?,?) `

    const info:OkPacket = await dal.execute(sqlNew, [userId, vacationsId]);
    const newFollow = info.insertId
    console.log(newFollow)

};

async function RemoveFollow(userId:number, vacationsId:number):Promise<void>{
    const sql = `DELETE FROM followers WHERE userId = ? AND vacationId = ?; `;

    const info:OkPacket = await dal.execute(sql, [userId, vacationsId]);
    const newFollow = info.insertId

};

export default {
    addFollow,
    RemoveFollow,
    getNumberOfFollowers

}