function recombinePenniesPounds(allAccounts) {
    for (let i=0;i<allAccounts.length;i++) {
    allAccounts[i].balancePennies/=100;
    allAccounts[i].balancePounds+=allAccounts[i].balancePennies;
    // Wanted to use countDecimals here to check no. of decimal places but kept throwing undefined
    }
}

module.exports={recombinePenniesPounds}