function m2(n) {
    if(n===0) return 1;
    return n - mm(m2(n-1));
}

function mm(n) {
    if(n===0) return 0;
    return n - m2(n-1);
}