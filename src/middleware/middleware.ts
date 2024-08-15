import path from 'path';
import _ from 'lodash';
import UserRecord from '../types/types';
import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
const fs = require('node:fs/promises');


const createUserFunction: (username: string, userData: UserRecord[], res: Response, filePath: string) => Promise<UserRecord> = async (username: string, userData: UserRecord[], res: Response, filePath:string): Promise<UserRecord> => 
{
    const newUser: UserRecord = {
        username: username,
        borrowedAnything: false,
        borrowedDate: ""
    };

    userData.push(newUser);
    await fs.writeFile(filePath, JSON.stringify(userData));
    res.locals.foundUser = newUser;

    return newUser;
}

const validateOverDueDate: (date: string, res: Response, user: UserRecord) => boolean = (date: string, res: Response, user: UserRecord): boolean => 
{
    if (date.length === 0) {
        return false;
    }else{
        const borrowedDate: Date = new Date(date);
        const currentDate: Date = new Date(moment.now());
        const testDate = new Date("2024-08-19");
        let differenceInTime: number | null = null;

    if (currentDate.getTime() > testDate.getTime()) {
        differenceInTime = currentDate.getTime() - testDate.getTime();
    } else {
        differenceInTime = testDate.getTime() - currentDate.getTime();
    }
   
    const differenceInDays: number = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays > 14;
    }
}


const handleUserFunction: (req: Request, res: Response, next: NextFunction) => Promise<void> = async function (req: Request, res: Response, next: NextFunction): Promise<void> 
{
    const filePath = path.join(__dirname, "../storage", "data.json");
    const username = req.body.username;

    if (!username || username.length < 1) {
        res.status(400).send("No username was given");
    } else {
        try {
            const data = await fs.readFile(filePath, "utf8");
            const userData: UserRecord[] = JSON.parse(data);

            if (userData.length < 1) {
                console.log("Database Is Empty!");
                createUserFunction(username, userData, res, filePath)
                next();
            } else {
                const findUser = (data: UserRecord[]): UserRecord | undefined => {
                    return _.find(data, user => user.username === username);
                }

                const isUserFound = findUser(userData);

                if (isUserFound) {
                    console.log("User was Found!");
                    res.locals.foundUser = isUserFound;
                    next();
                } else {
                    createUserFunction(username, userData, res, filePath);
                    res.status(400).send("User not Found! We Have Created A New User. Please Try Again!");
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error });
        }
    }
}

const handleOverDueFunction: (req: Request, res: Response, next: NextFunction) => Promise<void> = async function (req: Request, res: Response, next: NextFunction): Promise<void>  {
    const filePath = path.join(__dirname, "../storage", "data.json");

    try {
        const data = await fs.readFile(filePath, "utf8");
        const userData: UserRecord[] = JSON.parse(data);
        const lateOffendersArray: UserRecord[] = [];

        if(userData.length < 1){
            res.status(400).send("There are no users that have overdue books!")
        } else {
            userData.map((user => {
                const borrowDate = user.borrowedDate;
                validateOverDueDate(borrowDate,res,user) && lateOffendersArray.push(user);
            }));
        
            res.locals.lateOffendersArray = lateOffendersArray; 
            next()
        }  
    } catch (error) {
        next(error);
    }
}

module.exports = {handleUserFunction, handleOverDueFunction};