const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');

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

module.exports={splitPoundsPennies}