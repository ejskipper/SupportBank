function parseIntTransacAmounts(allTransactions) {
    allTransactions.forEach(transaction => {
        transaction.amountPounds = parseInt(transaction.amountPounds);
        transaction.amountPennies = parseInt(transaction.amountPennies);
      })
}


module.exports=parseIntTransacAmounts