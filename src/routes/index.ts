import { Request, Response, NextFunction, Router } from 'express';
const router = Router();
const {handleUserFunction, handleOverDueFunction} = require("../middleware/middleware");
import UserRecord from '../types/types';
const { lendUserABook, updateDatabase, returnBorrowedBook } = require('../utlis/utlis');

/* Borrow a Book  */
router.post('/borrow', handleUserFunction, async (req: Request, res: Response, next: NextFunction) => {
  //
  const handleBorrowFunction: () => Promise<void> = async () => {
    const user = res.locals.foundUser;
  
    if(user.borrowedAnything){
      res.status(400).send(`Sorry ${user.username} has a book taken out already!`);
    } else{
      const updatedUser = lendUserABook(user);
      updateDatabase(updatedUser);
      res.status(200).send(`${user.username} has taken out a Book!`)
    }
  }
  await handleBorrowFunction()
});

/* Return a Book */ 
router.post("/return", handleUserFunction, async (req: Request, res: Response, next: NextFunction) => {
    const handleReturnFunction: () => Promise<void> = async () => {
      const user: UserRecord = res.locals.foundUser;
      
      if (user.borrowedAnything) {
        const updatedUser = returnBorrowedBook(user);
        updateDatabase(updatedUser);
        res.status(200).send(`${user.username} has returned a Book!`)
      }else {
        res.status(400).send(`${user.username} does not have a Book taken out! There is nothing to return!`)
      }
    }
    await handleReturnFunction()
})


router.get("/overdueItems", handleOverDueFunction, async (req: Request, res: Response, next: NextFunction) => {
  const usersWithOverdueBooksArray: UserRecord[]  = res.locals.lateOffendersArray;
  
  if(usersWithOverdueBooksArray.length < 1){
    res.status(400).send("Sorry no users have any overdue books!");
  } else {
    res.status(200).json({"UsersWithOverdueBooks": usersWithOverdueBooksArray})
  }
})

module.exports = router;
