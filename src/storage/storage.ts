import UserRecord from '../types/types';
import { existsSync, writeFile, readFileSync } from 'fs';
import { join } from 'path';


const data: UserRecord[] = [];

// Create File To Store Users if the file does not exist

const init = function () {
  const filePath: string = join(__dirname, 'data.json');
  
  // Check if the file exists
  if (existsSync(filePath)) {
      // Check if the file is empty
      try {
          const fileContent = readFileSync(filePath, 'utf8');
          if (fileContent.trim().length === 0) {
              // File is empty, write the array to it
              writeFile(filePath, JSON.stringify(data, null, 2), (error) => {
                  if (error) {
                      console.log('An error has occurred', error);
                      return;
                  }
                  console.log('Array Initialized in empty file');
              });
          } else {
              console.log('File exists');
          }
      } catch (error) {
          console.log('An error has occurred while reading the file', error);
      }
  } else {
      // File does not exist, create and write the array to it
      writeFile(filePath, JSON.stringify(data, null, 2), (error) => {
          if (error) {
              console.log('An error has occurred', error);
              return;
          }
          console.log('Array Initialized in new file');
      });
  }
}


export default init;

