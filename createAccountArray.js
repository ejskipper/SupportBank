

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


module.exports={createAccountArray}