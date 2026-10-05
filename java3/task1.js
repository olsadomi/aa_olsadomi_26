function m1(a) {
    if(a.length <= 1) return a.length;
    const mid = a.length >> 1;
    return m1(a.slice(0, mid)) + m1(a.slice(mid))+1;
}