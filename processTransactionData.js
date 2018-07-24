const splitPoundsPennies = require('./splitPoundsPennies');
const addSubtractInAccounts = require('./addSubtractInAccounts');
const parseIntTransacAmounts = require('./parseIntTransacAmounts');
const recombinePenniesPounds = require('./recombinePenniesPounds');

function processTransactionData(allTransactions,allAccounts) {
    splitPoundsPennies(allTransactions);

    parseIntTransacAmounts(allTransactions);
    
    addSubtractInAccounts(allTransactions,allAccounts);

    recombinePenniesPounds(allAccounts);
}

module.exports=processTransactionData;