function addSubtractInAccounts(allTransactions,allAccounts) {
    for (let i=0;i<allTransactions.length;i++) {   //Subtract/add appropriate values from each account
        for (let j=0;j<allAccounts.length;j++) {
            if (allTransactions[i].fromAccount===allAccounts[j].owner) {
                allAccounts[j].balancePounds-=allTransactions[i].amountPounds;
                allAccounts[j].balancePennies-=allTransactions[i].amountPennies;
            }
            if (allTransactions[i].toAccount===allAccounts[j].owner) {
                allAccounts[j].balancePounds+=allTransactions[i].amountPounds;
                allAccounts[j].balancePennies+=allTransactions[i].amountPennies;
            }
        }
    }
}

module.exports=addSubtractInAccounts