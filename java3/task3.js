function m3(n) {
    if(n<=1) return 1;
    return m3(n-1) + m3(n-1);
}

//comment: Every call makes two identical calls with n - 1, 
// so its value doubles at each level and returns 2¹⁹ = 524,288. 
// Its full binary call tree contains 2²⁰ − 1 = 1,048,575 calls.




// Function/input   Returns     Calls
// m1 (8)	            15	    15
// m2(20)	            13	    1627
// m3(20)	        524288	    1048575