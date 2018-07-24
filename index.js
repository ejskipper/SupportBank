
const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');
const createAccountArray = require('./createAccountArray');
const userRequestList = require('./userRequestList');
const processTransactionData = require('./processTransactionData');
const getReadData = require('./getReadData');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs\\debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});


function runMyProgram() {

    let allTransactions = getReadData();
    
    const allAccounts = createAccountArray(allTransactions);
 
    processTransactionData(allTransactions,allAccounts);

    userRequestList(allTransactions,allAccounts);
}

logger.info('Program is running')
runMyProgram();