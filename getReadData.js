const readline = require('readline-sync');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

class Transaction {
    constructor(date,fromAccount,toAccount,narrative,amount,amountPounds,amountPennies){
    this.date=date;
    this.fromAccount=fromAccount;
    this.toAccount=toAccount;
    this.narrative=narrative;
    this.amount=amount;
    this.amountPounds=amountPounds;
    this.amountPennies=amountPennies;
    }
}

function getReadDatan() {
    console.log('\nPlease enter name of file to be used:');
    const fileChoice=readline.prompt();
    const fileType=fileChoice.split(".")[1];

    let allTransactions = [];    
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
        const parsedJSON=JSON.parse(jsonContents);
        allTransactions = parsedJSON.map(transaction => 
            new Transaction(transaction.Date,transaction.FromAccount,transaction.ToAccount,transaction.Narrative,transaction.Amount));
        break;
        default:
        console.log('\nFile type not recognised. Please ensure that file is of a supported type and entered in the format "fileName.filetype".');
        runMyProgram();
        break;
    }
    return allTransactions;
}

module.exports = getReadDatan;