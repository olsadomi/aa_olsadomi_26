function m3(n) {
    if(n<=1) return 1;
    return m3(n-1) + m3(n-1);
}



// Function/input   Returns     Calls
// m1 (8)	            15	    15
// m2(20)	            13	    1627
// m3(20)	        524288	    1048575