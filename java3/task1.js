function m1(a) {
    if(a.length <= 1) return a.length;
    const mid = a.length >> 1;
    return m1(a.slice(0, mid)) + m1(a.slice(mid))+1;
}

// comment: t repeatedly splits the array in half, 
// producing a full binary recursion tree with 8 leaves 
// and 7 internal nodes, so there are 15 calls. 
// Each leaf returns 1 and every internal call adds 1, 
// giving 8 + 7 = 15.