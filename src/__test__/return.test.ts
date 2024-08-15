import {describe,expect, test} from '@jest/globals';
const {returnBorrowedBook } = require("../utlis/utlis")



// Test Return Utils Function 
describe("Test Return Functions And Route", () => {
    test('returnBorrowedBook should return false when passed a user object that does not have a book already taken out', () => {
        expect(returnBorrowedBook({username: "Josh", borrowedDate: "2024-08-01", borrowedAnything: false})).toBe(false);
    })

    test('returnBorrowedBook should return true when passed a user object that does have a book taken out', () => {
        expect(returnBorrowedBook({username: "Josh", borrowedDate: "2024-08-01",  borrowedAnything: true})).toBe(true)
    })
})