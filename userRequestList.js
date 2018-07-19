const readline = require('readline-sync');
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
module.exports={userRequestList}