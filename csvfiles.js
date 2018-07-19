const readline = require('readline-sync');

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

function splitPoundsPennies(allTransactions) {
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
}

function createAccountArray(allTransactions) {
    let allFromNames=[];                         
    let allToNames=[];
    for (let i=0; i<allTransactions.length;i++) {
        allFromNames[i]=allTransactions[i].FromAccount;
        allToNames[i]=allTransactions[i].ToAccount;
    }
    let allNames=allFromNames.concat(allToNames);
    removeDuplicates(allNames);
    let allAccounts=[];                 
    for (let i=0;i<allNames.length;i++) {
        allAccounts[i]=new Account(allNames[i],0,0);
    }
    return allAccounts;
}

function parseIntTransacAmounts(allTransactions) {
    for (let i=0;i<allTransactions.length;i++) {
        allTransactions[i].amountPounds=parseInt(allTransactions[i].amountPounds)
        allTransactions[i].amountPennies=parseInt(allTransactions[i].amountPennies)
    }
}


function addSubtractInAccounts(allTransactions,allAccounts) {
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
}


function recombinePenniesPounds(allAccounts) { //This doesn't work?
    for (let i=0;i<allAccounts.length;i++) {
    allAccounts[i].balancePennies/=100;
    allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
    // Wanted to use countDecimals here to check no. of decimal places but kept throwing undefined
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
function userRequestList(allTransactions,allAccounts) {
    console.log('Would you like to list all accounts (List All), or search for transactions for a particular account (List ___)?\n');
    const response=readline.prompt();
    if (response==='List All') {
        listAll(allAccounts);
    } else {
        const chosenName=response.slice(5);
        listAccountTransactions(allTransactions,chosenName);
    }
}

module.exports={createAccountArray,parseIntTransacAmounts,addSubtractInAccounts,recombinePenniesPounds,userRequestList,splitPoundsPennies}