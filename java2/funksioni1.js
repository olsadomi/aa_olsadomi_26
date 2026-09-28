function collatz(n) {
    if (!Number.isInteger(n) || n <= 0) {
        throw new Error("n must be a positive integer.");
    }

    let steps = 0;

    while (n !== 1) {
        if (n % 2 === 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }

        steps++;
    }

    return steps;
}


const testValues = [1, 2, 3, 6, 11, 27];

console.log("Collatz Test Results:");
console.log("---------------------");

for (const n of testValues) {
    try {
        const steps = collatz(n);
        console.log(`n = ${n} -> ${steps} steps`);
    } catch (error) {
        console.log(`n = ${n} -> ${error.message}`);
    }
}
//The worst-case complexity of the Collatz algorithm is unknown because
//no general upper bound on the number of iterations required to reach 1 has been proven for all positive integers.