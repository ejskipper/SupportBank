const readline = require('readline-sync');

const MagicCSV = require("magic-csv");
csv = new MagicCSV({trim: true});

const log4js = require('log4js');

const logger = log4js.getLogger('logs\\debug.log');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs\\debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

class Transaction {
    constructor(date,fromPerson,toPerson,narrative,amountPounds,amountPennies){
    this.date=date;
    this.fromPerson=fromPerson;
    this.toPerson=toPerson;
    this.narrative=narrative;
    this.amountPounds=amountPounds;
    this.amountPennies=amountPennies;
    }
}

class Account {
    constructor(owner,balancePounds,balancePennies){
        this.owner=owner;
        this.balancePounds=balancePounds;
        this.balancePennies=balancePennies;
    }
}

function removeDuplicates(inputArray) {
    for (let i=0;i<inputArray.length;i++) {
        const testElement=inputArray[i];
        for (j=0;j<inputArray.length;j++) {
            if (inputArray[i]===inputArray[j]&&i!==j) {
                inputArray.splice(j,1);
                j--;
            }

        }

    }
}

function countDecimals(value) { 
    if ((value % 1) != 0) 
        return value.toString().split(".")[1].length;  
    return 0;
}

var allTransactions=[];

console.log('Please enter name of file to be used:')
const fileChoice=readline.prompt();

csv.readFile(fileChoice, function() {
     numberOfRows=csv.getRowCount()
     if (numberOfRows) {
         logger.info('Data extracted from file.')
     } else {
         logger.error('File not opened successfully.')
     }

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

    var allFromNames=csv.getCol(1);     //Create an array containing each name from the data
    var allToNames=csv.getCol(2);
    var allNames = allFromNames.concat(allToNames); 
    removeDuplicates(allNames);    
    
    var allAccounts=[];                 //Create an array containing the accounts of each individual
    for (let i=0;i<allNames.length;i++) {
        allAccounts[i]=new Account(allNames[i],0,0);
    }

    for (let i=0;i<allTransactions.length;i++) {
        allTransactions[i].amountPounds=parseInt(allTransactions[i].amountPounds)
        allTransactions[i].amountPennies=parseInt(allTransactions[i].amountPennies)
    }
    for (let i=0;i<allTransactions.length;i++) {   //Subtract/add appropriate values from each account
        for (let j=0;j<allAccounts.length;j++) {
            if (allTransactions[i].fromPerson===allAccounts[j].owner) {
                allAccounts[j].balancePounds-=allTransactions[i].amountPounds;
                allAccounts[j].balancePennies-=allTransactions[i].amountPennies;
            }
            if (allTransactions[i].toPerson===allAccounts[j].owner) {
                allAccounts[j].balancePounds+=allTransactions[i].amountPounds;
                allAccounts[j].balancePennies+=allTransactions[i].amountPennies;
            }
            if (isNaN(allAccounts[j].balancePounds)||isNaN(allAccounts[j].balancePennies)) {
                logger.error(`Transaction ${i} caused error in account ${j} (${allAccounts[j].owner})`)
            }
        }
        
    }
    
    for (let i=0;i<allAccounts.length;i++) {
        allAccounts[i].balancePennies/=100;
        allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
        if (countDecimals(allAccounts[i].balancePounds)>2) {
            logger.error(`Invalid balance in account ${i} (${allAccounts[i].owner}): More than two decimal places`)
        }
    }

    function listAll() {
        console.log('The following accounts were found:\n');
        for (let i=0;i<allAccounts.length;i++) {
            console.log(allAccounts[i].owner);
            console.log('£',allAccounts[i].balancePounds,'\n');
        }
    }
    
    function listAccountTransactions(name) {
        console.log(`\nThe following transactions were found for ${name}:\n`)
        for (let i=0;i<allTransactions.length;i++) {
            if (allTransactions[i].fromPerson===name||allTransactions[i].toPerson===name) {
                console.log(`${allTransactions[i].date}: £${allTransactions[i].amountPounds}.${allTransactions[i].amountPennies} 
                from ${allTransactions[i].fromPerson} to ${allTransactions[i].toPerson}. Narrative: ${allTransactions[i].narrative}\n`);
            }
        }
    }
    console.log('Would you like to list all accounts (List All), or search for transactions for a particular account (List ___)?\n');
    const response=readline.prompt();
    if (response==='List All') {
        listAll();
    } else {
        const chosenName=response.slice(5);
        listAccountTransactions(chosenName);
    }
    
});

