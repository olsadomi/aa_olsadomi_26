// BEST AND WORST CASE: Palindrome checker
// Compares letters from both ends, moving toward the middle.
// Best case:  first and last letters differ -> 1 comparison -> O(1)
// Worst case: the word IS a palindrome -> n/2 comparisons -> O(n)

function isPalindrome(word) {
  let steps = 0;
  let left = 0;
  let right = word.length - 1;

  while (left < right) {
    steps++;
    if (word[left] !== word[right]) {
      console.log(`"${word}" is NOT a palindrome (${steps} comparison(s))`);
      return false;
    }
    left++;
    right--;
  }

  console.log(`"${word}" IS a palindrome (${steps} comparison(s))`);
  return true;
}

isPalindrome("javascript");

isPalindrome("racecar");