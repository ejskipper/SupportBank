function parseIntTransacAmounts(allTransactions) {
    for (let i=0;i<allTransactions.length;i++) {
        allTransactions[i].amountPounds=parseInt(allTransactions[i].amountPounds)
        allTransactions[i].amountPennies=parseInt(allTransactions[i].amountPennies)
    }
}


module.exports={parseIntTransacAmounts}