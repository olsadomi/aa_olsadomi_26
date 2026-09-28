/*
 * QuickSort worst-case demonstration.
 * The algorithm always chooses the first element of a subarray as its pivot.
 */

function generateWorstCase(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new RangeError("n must be a non-negative integer");
    }

    // Ascending values guarantee that the first value is always the smallest.
    const worstCase = new Array(n);
    for (let i = 0; i < n; i++) {
        worstCase[i] = i + 1;
    }

    return worstCase;
}

function quickSort(arr) {
    let comparisons = 0;

    function swap(firstIndex, secondIndex) {
        const temporary = arr[firstIndex];
        arr[firstIndex] = arr[secondIndex];
        arr[secondIndex] = temporary;
    }

    function partition(low, high) {
        const pivot = arr[low];
        let smallerElementPosition = low + 1;

        for (let current = low + 1; current <= high; current++) {
            comparisons++;

            if (arr[current] < pivot) {
                swap(current, smallerElementPosition);
                smallerElementPosition++;
            }
        }

        const pivotPosition = smallerElementPosition - 1;
        swap(low, pivotPosition);
        return pivotPosition;
    }

    function sortSubarray(low, high) {
        if (low >= high) {
            return;
        }

        const pivotPosition = partition(low, high);
        sortSubarray(low, pivotPosition - 1);
        sortSubarray(pivotPosition + 1, high);
    }

    sortSubarray(0, arr.length - 1);
    return comparisons;
}

function runDemonstration() {
    const inputSizes = [10, 100, 1000, 5000];

    console.log("n\tcomparisons\ttheoretical n(n-1)/2");

    for (const n of inputSizes) {
        const input = generateWorstCase(n);
        const comparisons = quickSort(input);
        const theoreticalComparisons = n * (n - 1) / 2;

        console.log(`${n}\t${comparisons}\t\t${theoreticalComparisons}`);
    }
}

if (typeof require === "undefined" || require.main === module) {
    runDemonstration();
}

// These exports make the functions easy to test from another Node.js file.
if (typeof module !== "undefined") {
    module.exports = { generateWorstCase, quickSort };
}
