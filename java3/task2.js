function m2(n) {
    if(n===0) return 1;
    return n - mm(m2(n-1));
}

function mm(n) {
    if(n===0) return 0;
    return n - m2(mm(n-1));
}

//comment: The mutually recursive calculations between m2() 
// and mm() eventually produce m2(20) = 13. 
// Because results are recalculated instead of saved, 
// evaluating it requires 1,627 total calls to m2() and mm().