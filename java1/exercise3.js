//time complexity : O(n^2)
//space complexity : O(1)

function f3 (nums) {
    const n = nums.length;
    for(let i=0; i<n;i++) {
        for(let j=i+1;j<n;j++) {
            if(nums[i] === nums[j]) return true;
    }
}
    return false;
}