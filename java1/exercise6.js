//time complexity : O(n^2)
//space complexity : O(n)
function f6(nums) {
    const out = [];
    for(const x of nums) {
        out.unshift(x); //unshift adds to the front of the array, so we are reversing the order of the elements
    }
    return out;
}