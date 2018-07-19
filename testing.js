function countDecimals(value) { 
    if ((value % 1) != 0) 
        return value.toString().split(".")[1].length;  
    return 0;
}

bob=3.42454
console.log(countDecimals(bob));
