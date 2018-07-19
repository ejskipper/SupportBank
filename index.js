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
    constructor(Date,FromAccount,ToAccount,Narrative,amountPounds,amountPennies){
    this.Date=Date;
    this.FromAccount=FromAccount;
    this.ToAccount=ToAccount;
    this.Narrative=Narrative;
    this.amountPounds=amountPounds;
    this.amountPennies=amountPennies;
    }
}

function listAll(inputArray) {              
    console.log('The following accounts were found:\n');
    for (let i=0;i<inputArray.length;i++) {
        console.log(inputArray[i].owner);
        console.log('£',inputArray[i].balancePounds,'\n');
    }
}

function listAccountTransactions(inputData,name) {
    console.log(`\nThe following transactions were found for ${name}:\n`)
    for (let i=0;i<inputData.length;i++) {
        if (inputData[i].FromAccount===name||inputData[i].ToAccount===name) {
            console.log(`${inputData[i].Date}: £${inputData[i].amountPounds}.${inputData[i].amountPennies} 
            from ${inputData[i].FromAccount} to ${inputData[i].ToAccount}. Narrative: ${inputData[i].Narrative}\n`);
        }
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

        for (let i=0;i<numberOfRows;i++) {      //Create an array containing all transactions as individual objects
            let rowContent=csv.getRow(i);
            let stringAmount=rowContent[4].toString();
            let arrayAmount=stringAmount.split('.');
            rowContent[4]=arrayAmount[0];
            rowContent[5]=arrayAmount[1];
            allTransactions[i]=new Transaction(rowContent[0],rowContent[1],rowContent[2],rowContent[3],rowContent[4],rowContent[5]);
            if (allTransactions[i].amountPennies===undefined) {
                allTransactions[i].amountPennies='0';
            }
            if (isNaN(allTransactions[i].amountPounds)){
                logger.error(`Line ${i+2} of file produced invalid data: Pounds not a number`);
            }
            if (isNaN(allTransactions[i].amountPennies)){
                logger.error(`Line ${i+2} of file produced invalid data: Pennies not a number`);
            }
        }

        const allAccounts=csvfiles.createAccountArray(allTransactions);
        csvfiles.parseIntTransacAmounts(allTransactions);
        
        csvfiles.addSubtractInAccounts(allTransactions,allAccounts);
        
        for (let i=0;i<allAccounts.length;i++) {
            allAccounts[i].balancePennies/=100;
            allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
            // Wanted to use countDecimals here to check no. of decimal places but kept throwing undefined
            }
        
        
        
        console.log('Would you like to list all accounts (List All), or search for transactions for a particular account (List ___)?\n');
        const response=readline.prompt();
        if (response==='List All') {
            listAll(allAccounts);
        } else {
            const chosenName=response.slice(5);
            listAccountTransactions(allTransactions,chosenName);
        }
        
    });
} else if (fileType==='json') {
    const fileContents=fs.readFileSync('Transactions2013.json','utf8');
    const allTransactions=JSON.parse(fileContents);

    const allAccounts=csvfiles.createAccountArray(allTransactions);

    
        for (let i=0;i<allTransactions.length;i++) {
            let stringAmount=allTransactions[i].Amount.toString();
            let arrayAmount=stringAmount.split('.');
            allTransactions[i].amountPounds=arrayAmount[0];
            allTransactions[i].amountPennies=arrayAmount[1];
            if (allTransactions[i].amountPennies===undefined) {
                allTransactions[i].amountPennies='0';
            }
            if (isNaN(allTransactions[i].amountPounds)){
                logger.error(`?? ${i+2} of file produced invalid data: Pounds not a number`);
            }
            if (isNaN(allTransactions[i].amountPennies)){
                logger.error(`?? ${i+2} of file produced invalid data: Pennies not a number`);
            }
        }

        csvfiles.parseIntTransacAmounts(allTransactions);
        
        csvfiles.addSubtractInAccounts(allTransactions,allAccounts);

        for (let i=0;i<allAccounts.length;i++) {
            allAccounts[i].balancePennies/=100;
            allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
            }

        console.log('Would you like to list all accounts (List All), or search for transactions for a particular account (List ___)?\n');
        const response=readline.prompt();
        if (response==='List All') {
            listAll(allAccounts);
        } else {
            const chosenName=response.slice(5);
            listAccountTransactions(allTransactions,chosenName);
        }

} else {
    console.log('File type not recognised. Please ensure that file is of a supported type and entered in the format "fileName.filetype".')
}
