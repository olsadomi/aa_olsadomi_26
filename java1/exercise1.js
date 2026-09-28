//time complexity : O(n)
//space complexity : O(1)
function f1(nums) {
    let total = 0;
    for(const x of nums) {
        total+=x;
    }
    return total;
}