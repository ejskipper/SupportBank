function countDecimals(value) { 
    if ((value % 1) != 0) 
        return value.toString().split(".")[1].length;  
    return 0;
}


const parse = require('csv-parse/lib/sync')
const fs = require('fs')

const fileContents=fs.readFileSync('Transactions2014.csv','utf8');

const parsedFile=parse(fileContents);

console.log(parsedFile[1][2]);
