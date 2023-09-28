const request = require("request");     // retrieve the request module from node.js
const fs = require("fs");               // retrieve the file system from node.js
const readline = require("readline");   // retrieve the readline module from node.js

const url = process.argv[2]; // read the command-line arguments: URL;
const outPutPath = process.argv[3]; // command-line argument: intended outPutPath;

const filePath = '/Users/macbookair/lighthouse-labs/page-fetcher/index.html'

const content = 'Some content!';


if (!url || !outPutPath) {  // check if the URL and outPutPath are input correctly as command-line arguments;
  console.error("Usage: node fetcher.js <URL> <outPutPath>");
  process.exit(1);
} 

if (fs.existsSync(outPutPath)) { // check to see if the output file already exists - node.js method used - Thank-you StackOverflow;
  const rl = readline.createInterface({ // createInterface readline module implemented - Thank-you node.js.org API archive;
    input: process.stdin, // reads the input from the user;
    output: process,stdout // outputs to the console;
  });

  // rl module/function asks the user if they wish to overwrite the exisiting file;
  rl.question(`File ${outPutPath} already exists. Do you want to overwrite it? (Y/N): `, (answer) => {
    if (answer.toLowerCase() !== 'y') { // converts their answer to lowerCase to account for accidental CAPSLOCK being active and preventing protential chaos;
      console.log("Aborted: File not overwritten."); // if N/n is entered, system informs the user of their choice with a message;
      rl.close(); // closes the readline interface;
      process.exit(0); // exits the process;
    } else { // if the user enters Y/y;
      rl.close(); // then the readline interface closes;
      downloadAndSave(); // and the downloadAndSave function (below) is executed;
    }
  });
} else { // if the file being created doesnt exist;
  downloadAndSave(); // then the file is downloaded and saved;
}

const downloadAndSave = () => { // function to download and save the file;
  request(url, (error, response, body) => { // initiates an HTTP request to the input URL
    if (error) { // if the request errors;
      console.error("Error", error); // an error message is output to user, and the error is logged.
      return;
    }
    // HTTP status code 200: "Everything went great!"
    if (response.statusCode !== 200) { // checks if the HTTP status is any code other than 200;
      console.error(`HTTP ERROR! status code: ${response.statusCode}`); // if any status code other than 200 is returned from HTTP;
      return; //  an error message is output to the user, and logged;
    }   
    
    fs.writeFile(outPutPath, content, (error) => { // write the downloaded content to the specified output file;
      if (error) {
        console.error(error); // outputs an error message and logs and file writing errors;
      } else {
        console.log(`File "${filePath}" written successfully.`); // logs a success message;
      } 
      console.log(`Downloaded and saved ${body.length} bytes to ${outPutPath}`); // logs a success message detailing file size and path;
    });
  });
}
