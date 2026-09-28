//time complexity : O(n)
//space complexity : O(1)

function f4 (nums) {
    let i = 0, j= nums.length-1, best = 0;
    while(i<j) {
        const w = Math.min(nums[i], nums[j]) * (j-i);
        if(w>best) best = w;
        if(nums[i]<nums[j]) i++;
        else j--;
    }
    return best;
}