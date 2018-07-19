fs = require('fs')
const fileContents=fs.readFileSync('Transactions2013.json','utf8');

const parsedFileContents=JSON.parse(fileContents);
console.log(parsedFileContents);