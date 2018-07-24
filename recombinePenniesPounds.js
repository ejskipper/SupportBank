function recombinePenniesPounds(allAccounts) {
    allAccounts.forEach(account => {
        account.balancePennies /= 100;
        account.balancePounds += account.balancePennies;
    })
    // Wanted to use countDecimals here to check no. of decimal places but kept throwing undefined
    }

module.exports=recombinePenniesPounds