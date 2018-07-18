const readline = require('readline-sync');

const MagicCSV = require("magic-csv");
csv = new MagicCSV({trim: true});

const moment = require('moment');
moment().format();

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

var allTransactions=[];

csv.readFile('DodgyTransactions2015.csv', function() {
     numberOfRows=csv.getRowCount()

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
        }
        
    }
    
    for (let i=0;i<allAccounts.length;i++) {
        allAccounts[i].balancePennies/=100;
        allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
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

