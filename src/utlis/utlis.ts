import path from 'path';
import _ from 'lodash';
import UserRecord from '../types/types';
const fs = require('node:fs/promises');
import moment from 'moment';


const lendUserABook = function (user: UserRecord): UserRecord | boolean {
    const formatBorrowDate = () => {
        const currentDate = moment.now();

        const yy = new Date(currentDate).getFullYear();
        let mm = new Date(currentDate).getMonth() + 1;
        let dd = new Date(currentDate).getDate();

        return `${yy}-${mm}-${dd}`
    }
    
    const updatedUser: UserRecord = {
        username: user.username,
        borrowedAnything: true,
        borrowedDate: formatBorrowDate()
    }

    if(user.borrowedAnything){
        return false;
    } else {
        return true;
    }
}

const returnBorrowedBook = (user: UserRecord): UserRecord | boolean => {
    const updatedUser: UserRecord = {
        username: user.username,
        borrowedAnything: false,
        borrowedDate: ""
    }

    if (user.borrowedAnything) {
        return true;
    } else{
        return false;
    }
}


const updateDatabase = async (userObj: UserRecord) => {
    const filePath = path.join(__dirname, "../storage", "data.json");

    try{
        const data = await fs.readFile(filePath, "utf8");
        const jsonData = JSON.parse(data);
    
        const findUser = (data: UserRecord[]): number  => {
            return _.findIndex(data, user => user.username === userObj.username);
        }
    
        const foundUserIndex = findUser(jsonData);
    
        jsonData[foundUserIndex] = userObj;
    
        // Write to file
        await fs.writeFile(filePath, JSON.stringify(jsonData));   

    }catch(err){
       console.log(err);
    }
}

module.exports = {lendUserABook, updateDatabase, returnBorrowedBook};