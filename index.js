const readline = require('readline-sync');
const parse = require('csv-parse/lib/sync');
const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');
const fs = require('fs');
const splitPoundsPennies = require('./splitPoundsPennies');
const createAccountArray = require('./createAccountArray');
const addSubtractInAccounts = require('./addSubtractInAccounts');
const parseIntTransacAmounts = require('./parseIntTransacAmounts');
const recombinePenniesPounds = require('./recombinePenniesPounds');
const userRequestList = require('./userRequestList');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs\\debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

class Transaction {
    constructor(Date,FromAccount,ToAccount,Narrative,Amount,amountPounds,amountPennies){
    this.Date=Date;
    this.FromAccount=FromAccount;
    this.ToAccount=ToAccount;
    this.Narrative=Narrative;
    this.Amount=Amount;
    this.amountPounds=amountPounds;
    this.amountPennies=amountPennies;
    }
}
function runMyProgram() {
    console.log('\nPlease enter name of file to be used:');
    const fileChoice=readline.prompt();
    const fileType=fileChoice.split(".")[1];
    let allTransactions = [];
// Make this a separate module to read files
    switch (fileType) {
        case 'csv':
        const csvContents=fs.readFileSync(fileChoice,'utf8');
        const parsedFile=parse(csvContents);
                
        for (let i=1;i<parsedFile.length;i++) {
            allTransactions.push(new Transaction(parsedFile[i][0],parsedFile[i][1],parsedFile[i][2],parsedFile[i][3],parsedFile[i][4]));
        }
        break;
        case 'json':
        const jsonContents=fs.readFileSync(fileChoice,'utf8');
        allTransactions=JSON.parse(jsonContents);
        break;
        default:
        console.log('\nFile type not recognised. Please ensure that file is of a supported type and entered in the format "fileName.filetype".');
        runMyProgram();
        break;
    }
    const allAccounts=createAccountArray(allTransactions);
// Combine these four vv
    splitPoundsPennies(allTransactions);

    parseIntTransacAmounts(allTransactions);
    
    addSubtractInAccounts(allTransactions,allAccounts);

    recombinePenniesPounds(allAccounts);

    userRequestList(allTransactions,allAccounts);
}

logger.info('Program is running')
runMyProgram();