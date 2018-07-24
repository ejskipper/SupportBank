const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');

function splitPoundsPennies(allTransactions) {
    allTransactions.forEach(transaction => {
        const stringAmount = transaction.amount.toString();
        const arrayAmount = stringAmount.split('.');
        transaction.amountPounds=arrayAmount[0];
        transaction.amountPennies=arrayAmount[1];

        transaction.amountPennies = arrayAmount[1] || 0;

        if (isNaN(transaction.amountPounds)){
            logger.error(`Line ${i+2} of file produced invalid data: Pounds not a number`);
        }
        if (isNaN(transaction.amountPennies)){
            logger.error(`Line ${i+2} of file produced invalid data: Pennies not a number`);
        }
    })
}

module.exports=splitPoundsPennies 