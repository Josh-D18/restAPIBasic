import {describe,expect, test} from '@jest/globals';
const { lendUserABook } = require("../utlis/utlis")


// Test Borrow Utils Function
describe("Test Borrow Functions and Route", () => {
    test('lendUserABook should return false when passed a user object that has a book already taken out', () => {
        expect(lendUserABook({username:"Josh", borrowedAnything: true,
        borrowedDate: "2024-08-01"})).toBe(false);
    })

    test('lendUserABook should return true when passed a user object that does not have a book already taken out', () => {
        expect(lendUserABook({username:"Josh", borrowedAnything: false,
        borrowedDate: "2024-08-01"})).toBe(true);
    })
})



