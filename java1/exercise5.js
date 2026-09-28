//time complexity : O(n)
//space complexity : O(n)
function f5(nums) {
    const counts = {};
    for(const x of nums) {{
        counts[x] = (counts[x] || 0) + 1;
    }
    let best = null;
    for(const x in counts) {
        if(best === null || counts[x] > counts[best])  {
            best = x;
        }
    }
    return best;
}}