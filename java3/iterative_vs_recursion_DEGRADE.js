// Array sum: recursion degrades the auxiliary space complexity.

function validateArray(numbers) {
    if (!Array.isArray(numbers)) {
        throw new TypeError("The input must be an array");
    }
}

// Time: O(n), auxiliary space: O(n)
function recursiveSum(numbers, index = 0, statistics) {
    validateArray(numbers);

    if (statistics !== undefined) {
        statistics.calls++;
        statistics.maximumDepth = Math.max(statistics.maximumDepth, index + 1);
    }

    if (index === numbers.length) {
        return 0;
    }

    return numbers[index] + recursiveSum(numbers, index + 1, statistics);
}

// Time: O(n), auxiliary space: O(1)
function iterativeSum(numbers, statistics) {
    validateArray(numbers);
    let total = 0;

    for (let index = 0; index < numbers.length; index++) {
        if (statistics !== undefined) {
            statistics.iterations++;
        }

        total += numbers[index];
    }

    return total;
}

function createInput(size) {
    const numbers = new Array(size);

    for (let index = 0; index < size; index++) {
        numbers[index] = 1;
    }

    return numbers;
}

function runDemonstration() {
    const inputSizes = [10, 100, 1000, 5000];

    console.log("n\tsum\trecursive calls\tmaximum depth\titerations");

    for (const size of inputSizes) {
        const numbers = createInput(size);
        const recursiveStatistics = { calls: 0, maximumDepth: 0 };
        const iterativeStatistics = { iterations: 0 };

        const recursiveResult = recursiveSum(numbers, 0, recursiveStatistics);
        const iterativeResult = iterativeSum(numbers, iterativeStatistics);

        if (recursiveResult !== iterativeResult) {
            throw new Error("The implementations produced different results");
        }

        console.log(
            `${size}\t${recursiveResult}\t${recursiveStatistics.calls}`
            + `\t\t${recursiveStatistics.maximumDepth}`
            + `\t\t${iterativeStatistics.iterations}`
        );
    }

    console.log("\nComplexity:");
    console.log("Recursive sum: O(n) time, O(n) auxiliary space");
    console.log("Iterative sum: O(n) time, O(1) auxiliary space");
}

if (typeof require === "undefined" || require.main === module) {
    runDemonstration();
}

if (typeof module !== "undefined") {
    module.exports = { recursiveSum, iterativeSum };
}
