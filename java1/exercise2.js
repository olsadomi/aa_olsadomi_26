//time comple§xity: O(n^2)
//space complexity: O(n)
function f2(nums) {
    const seen = [], out = [];
    for(const x of nums) {
        if (!seen.includes(x)) {
            seen.push(x);
            out.push(x);
        }
    }
    return out;
}