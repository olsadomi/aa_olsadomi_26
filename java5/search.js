const {
    bruteForce,
    shiftTable,
    shift,
    horspool,
    horspool2
} = require("./task1");

// Data from the lecture example.
const T = "JIM SAW ME IN A BARBERSHOP";
const P = "BARBER";

// Predicted results:
// shiftTable(P)  -> Map { B => 2, A => 4, R => 3, E => 1 }
// bruteForce     -> 16
// horspool       -> 16
// horspool2      -> -1 (it skips the valid alignment at index 16)

console.log("T:", T);
console.log("P:", P);
console.log("shiftTable(P):", shiftTable(P));
console.log("bruteForce(T, P):", bruteForce(T, P));
console.log("horspool(T, P):", horspool(T, P));
console.log("horspool2(T, P):", horspool2(T, P));

// Shows the pattern-start position for every alignment checked by Horspool.
function horspoolAlignments(T, P) {
    const n = T.length;
    const m = P.length;
    const table = shiftTable(P);
    const alignments = [];
    let i = m - 1;

    while (i <= n - 1) {
        alignments.push(i - m + 1);

        let k = 0;
        while (k <= m - 1 && P[m - 1 - k] === T[i - k]) {
            k++;
        }

        if (k === m) {
            break;
        }

        i += shift(table, T[i], m);
    }

    return alignments;
}

console.log("horspool alignments:", horspoolAlignments(T, P));

// Shows why horspool2 fails for this example. Its mismatch-based shift moves
// from alignment 13 directly to 17, skipping the real match at index 16.
function horspool2Alignments(T, P) {
    const n = T.length;
    const m = P.length;
    const table = shiftTable(P);
    const alignments = [];
    let i = m - 1;

    while (i <= n - 1) {
        alignments.push(i - m + 1);

        let k = 0;
        while (k <= m - 1 && P[m - 1 - k] === T[i - k]) {
            k++;
        }

        if (k === m) {
            break;
        }

        i += shift(table, T[i - k], m);
    }

    return alignments;
}

console.log("horspool2 alignments:", horspool2Alignments(T, P));
