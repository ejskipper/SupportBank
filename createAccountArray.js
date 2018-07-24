

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

function createAccountArray(allTransactions) {
    const allFromNames = allTransactions.map(transaction => transaction.FromAccount);
    const allToNames = allTransactions.map(transaction => transaction.ToAccount);
    let allNames=allFromNames.concat(allToNames);
    removeDuplicates(allNames);
    const allAccounts = allNames.map(name => new Account(name,0,0))
    return allAccounts;
}


module.exports=createAccountArray