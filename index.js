const readline = require('readline-sync');
const MagicCSV = require("magic-csv");
csv = new MagicCSV({trim: true});
const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');
const fs = require('fs')

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

class Account {
    constructor(owner,balancePounds,balancePennies){
        this.owner=owner;
        this.balancePounds=balancePounds;
        this.balancePennies=balancePennies;
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

        let allFromNames=csv.getCol(1);     //Create an array containing each name from the data
        let allToNames=csv.getCol(2);
        let allNames = allFromNames.concat(allToNames); 
        removeDuplicates(allNames);    
        
        let allAccounts=[];                 //Create an array containing the accounts of each individual
        for (let i=0;i<allNames.length;i++) {
            allAccounts[i]=new Account(allNames[i],0,0);
        }

        for (let i=0;i<allTransactions.length;i++) {
            allTransactions[i].amountPounds=parseInt(allTransactions[i].amountPounds)
            allTransactions[i].amountPennies=parseInt(allTransactions[i].amountPennies)
        }
        for (let i=0;i<allTransactions.length;i++) {   //Subtract/add appropriate values from each account
            for (let j=0;j<allAccounts.length;j++) {
                if (allTransactions[i].FromAccount===allAccounts[j].owner) {
                    allAccounts[j].balancePounds-=allTransactions[i].amountPounds;
                    allAccounts[j].balancePennies-=allTransactions[i].amountPennies;
                }
                if (allTransactions[i].ToAccount===allAccounts[j].owner) {
                    allAccounts[j].balancePounds+=allTransactions[i].amountPounds;
                    allAccounts[j].balancePennies+=allTransactions[i].amountPennies;
                }
            }
            
        }
        
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
    const parsedFileContents=JSON.parse(fileContents);

    let allFromNames=[];                                //Create array containing all names from each column
    let allToNames=[];
    for (let i=0; i<parsedFileContents.length;i++) {
        allFromNames[i]=parsedFileContents[i].FromAccount;
        allToNames[i]=parsedFileContents[i].ToAccount;
    }
    let allNames=allFromNames.concat(allToNames);
    removeDuplicates(allNames);

    let allAccounts=[];                 //Create an array containing the accounts of each individual
        for (let i=0;i<allNames.length;i++) {
            allAccounts[i]=new Account(allNames[i],0,0);
        }

        for (let i=0;i<parsedFileContents.length;i++) {
            let stringAmount=parsedFileContents[i].Amount.toString();
            let arrayAmount=stringAmount.split('.');
            parsedFileContents[i].amountPounds=arrayAmount[0];
            parsedFileContents[i].amountPennies=arrayAmount[1];
            if (parsedFileContents[i].amountPennies===undefined) {
                parsedFileContents[i].amountPennies='0';
            }
            if (isNaN(parsedFileContents[i].amountPounds)){
                logger.error(`?? ${i+2} of file produced invalid data: Pounds not a number`);
            }
            if (isNaN(parsedFileContents[i].amountPennies)){
                logger.error(`?? ${i+2} of file produced invalid data: Pennies not a number`);
            }
        }

        for (let i=0;i<parsedFileContents.length;i++) {
            parsedFileContents[i].amountPounds=parseInt(parsedFileContents[i].amountPounds)
            parsedFileContents[i].amountPennies=parseInt(parsedFileContents[i].amountPennies)
        }
        
        for (let i=0;i<parsedFileContents.length;i++) {   //Subtract/add appropriate values from each account
            for (let j=0;j<allAccounts.length;j++) {
                if (parsedFileContents[i].FromAccount===allAccounts[j].owner) {
                    allAccounts[j].balancePounds-=parsedFileContents[i].amountPounds;
                    allAccounts[j].balancePennies-=parsedFileContents[i].amountPennies;
                }
                if (parsedFileContents[i].ToAccount===allAccounts[j].owner) {
                    allAccounts[j].balancePounds+=parsedFileContents[i].amountPounds;
                    allAccounts[j].balancePennies+=parsedFileContents[i].amountPennies;
                }
            }
            
        }

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
            listAccountTransactions(parsedFileContents,chosenName);
        }

} else {
    console.log('File type not recognised. Please ensure that file is of a supported type and entered in the format "fileName.filetype".')
}
