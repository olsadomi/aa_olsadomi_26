// ============================================
// Recursive vs Iterative DFS
// Time:            O(n)
// Auxiliary space: O(log n) (if balanced tree)
// ============================================

// ---------- Binary Tree Node ----------
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// ---------- Build a Balanced Binary Tree ----------
function buildBalancedTree(start, end) {
    if (start > end) {
        return null;
    }

    const mid = Math.floor((start + end) / 2);

    const node = new Node(mid);

    node.left = buildBalancedTree(start, mid - 1);
    node.right = buildBalancedTree(mid + 1, end);

    return node;
}

// ============================================
// 1. RECURSIVE DFS
// ============================================

function recursiveDFS(root, result = []) {
    if (root === null) {
        return result;
    }

    // Visit current node
    result.push(root.value);

    // Recursively visit left subtree
    recursiveDFS(root.left, result);

    // Recursively visit right subtree
    recursiveDFS(root.right, result);

    return result;
}

// ============================================
// 2. ITERATIVE DFS
// ============================================

function iterativeDFS(root) {
    if (root === null) {
        return [];
    }

    const result = [];
    const stack = [root];

    while (stack.length > 0) {
        const node = stack.pop();

        // Visit current node
        result.push(node.value);

        // Push right first so left is processed first
        if (node.right !== null) {
            stack.push(node.right);
        }

        if (node.left !== null) {
            stack.push(node.left);
        }
    }

    return result;
}

// ============================================
// TEST
// ============================================

const n = 15;

const root = buildBalancedTree(1, n);

console.log("Binary Tree with", n, "nodes");
console.log("--------------------------------");

// Recursive
const recursiveResult = recursiveDFS(root);

console.log("Recursive DFS:");
console.log(recursiveResult);

// Iterative
const iterativeResult = iterativeDFS(root);

console.log("\nIterative DFS:");
console.log(iterativeResult);

// Check that both produce the same traversal
console.log(
    "\nSame result:",
    JSON.stringify(recursiveResult) === JSON.stringify(iterativeResult)
);

// ============================================
// COMPLEXITY
// ============================================

console.log("\nComplexity:");
console.log("Recursive DFS:");
console.log("  Time:  O(n)");
console.log("  Space: O(h)");

console.log("\nIterative DFS:");
console.log("  Time:  O(n)");
console.log("  Space: O(h)");

console.log("\nFor a balanced binary tree:");
console.log("  h = O(log n)");
console.log("  Therefore both use O(log n) auxiliary space.");