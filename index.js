const readline = require('readline-sync');
const MagicCSV = require("magic-csv");
csv = new MagicCSV({trim: true});
const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');
const fs = require('fs')
const csvfiles = require('./csvfiles')

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
function countDecimals(value) { 
    if ((value % 1) != 0) 
        return value.toString().split(".")[1].length;  
    return 0;
}

console.log('Please enter name of file to be used:')
const fileChoice=readline.prompt();
fileType=fileChoice.split(".")[1];

if (fileType==='csv') {
    csv.readFile(fileChoice, function() {
        numberOfRows=csv.getRowCount()
        if (numberOfRows) {
            logger.info('Data extracted from file.')
        } else {
            logger.error('File not opened successfully.')
        }

        
        let allTransactions=[];
        for (let i=0;i<numberOfRows;i++) {
            let rowContent=csv.getRow(i);
            allTransactions[i]=new Transaction(rowContent[0],rowContent[1],rowContent[2],rowContent[3],rowContent[4]);
        }

        csvfiles.splitPoundsPennies(allTransactions);

        const allAccounts=csvfiles.createAccountArray(allTransactions);

        csvfiles.parseIntTransacAmounts(allTransactions);
        
        csvfiles.addSubtractInAccounts(allTransactions,allAccounts);
        
        for (let i=0;i<allAccounts.length;i++) {
            allAccounts[i].balancePennies/=100;
            allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
            // Wanted to use countDecimals here to check no. of decimal places but kept throwing undefined
            }
        
        csvfiles.userRequestList(allTransactions,allAccounts);
        
    });
} else if (fileType==='json') {
    const fileContents=fs.readFileSync('Transactions2013.json','utf8');
    const allTransactions=JSON.parse(fileContents);

    const allAccounts=csvfiles.createAccountArray(allTransactions);

    csvfiles.splitPoundsPennies(allTransactions);

    csvfiles.parseIntTransacAmounts(allTransactions);
    
    csvfiles.addSubtractInAccounts(allTransactions,allAccounts);

    for (let i=0;i<allAccounts.length;i++) {
        allAccounts[i].balancePennies/=100;
        allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
        }

    csvfiles.userRequestList(allTransactions,allAccounts);

} else {
    console.log('File type not recognised. Please ensure that file is of a supported type and entered in the format "fileName.filetype".')
}
