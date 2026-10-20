let comparisons = 0;
let alignments = 0;

function resetCounters() {
    comparisons = 0;
    alignments = 0;
}

function getCounters() {
    return { comparisons, alignments };
}

function bruteForce(T, P) {
    const n = T.length;
    const m = P.length;

    for (let i = 0; i <= n - m; i++) {
        alignments++;
        let j = 0;

        while (j < m) {
            comparisons++;

            if (P[j] !== T[i + j]) {
                break;
            }

            j++;
        }

        if (j === m) {
            return i;
        }
    }

    return -1;
}

function shiftTable(P) {
    const m = P.length;
    const table = new Map();

    for (let j = 0; j < m - 1; j++) {
        table.set(P[j], m - 1 - j);
    }

    return table;
}

function shift(table, c, m) {
    return table.has(c) ? table.get(c) : m;
}

function horspool(T, P) {
    const n = T.length;
    const m = P.length;

    if (m === 0) {
        alignments++;
        return 0;
    }

    const table = shiftTable(P);
    let i = m - 1;

    while (i <= n - 1) {
        alignments++;
        let k = 0;

        while (k <= m - 1) {
            comparisons++;

            if (P[m - 1 - k] !== T[i - k]) {
                break;
            }

            k++;
        }

        if (k === m) {
            return i - m + 1;
        }

        i += shift(table, T[i], m);
    }

    return -1;
}

function horspool2(T, P) {
    const n = T.length;
    const m = P.length;

    if (m === 0) {
        alignments++;
        return 0;
    }

    const table = shiftTable(P);
    let i = m - 1;

    while (i <= n - 1) {
        alignments++;
        let k = 0;

        while (k <= m - 1) {
            comparisons++;

            if (P[m - 1 - k] !== T[i - k]) {
                break;
            }

            k++;
        }

        if (k === m) {
            return i - m + 1;
        }

        i += shift(table, T[i - k], m);
    }

    return -1;
}

function findAll(T, P) {
    const matches = [];
    const n = T.length;
    const m = P.length;

    if (m === 0) {
        return matches;
    }

    for (let i = 0; i <= n - m; i++) {
        alignments++;
        let j = 0;

        while (j < m) {
            comparisons++;

            if (P[j] !== T[i + j]) {
                break;
            }

            j++;
        }

        if (j === m) {
            matches.push(i);
        }
    }

    return matches;
}

function highlight(T, P) {
    const matches = findAll(T, P);

    if (matches.length === 0) {
        return T;
    }

    let result = "";
    let textIndex = 0;
    let matchIndex = 0;

    while (textIndex < T.length) {
        while (matchIndex < matches.length && matches[matchIndex] < textIndex) {
            matchIndex++;
        }

        if (matchIndex < matches.length && matches[matchIndex] === textIndex) {
            result += "[";

            for (let j = 0; j < P.length; j++) {
                result += T[textIndex + j];
            }

            result += "]";
            textIndex += P.length;
            matchIndex++;
        } else {
            result += T[textIndex];
            textIndex++;
        }
    }

    return result;
}

function goodSuffixTable(P) {
    const m = P.length;

    if (m === 0) {
        return [];
    }

    const d2 = new Array(m);
    d2[0] = 0;

    for (let k = 1; k < m; k++) {
        const suffixStart = m - k;
        let foundCopy = false;

        // Find the rightmost earlier copy of the suffix. Its preceding
        // character must differ from the character preceding the suffix.
        for (let copyStart = suffixStart - 1; copyStart >= 0; copyStart--) {
            let same = true;

            for (let j = 0; j < k; j++) {
                if (P[copyStart + j] !== P[suffixStart + j]) {
                    same = false;
                    break;
                }
            }

            if (!same) {
                continue;
            }

            if (copyStart > 0 && P[copyStart - 1] === P[suffixStart - 1]) {
                continue;
            }

            d2[k] = suffixStart - copyStart;
            foundCopy = true;
            break;
        }

        if (foundCopy) {
            continue;
        }

        // No admissible copy exists. Find the longest prefix that is also
        // a suffix, with a length strictly smaller than k.
        let prefixLength = k - 1;

        while (prefixLength > 0) {
            let same = true;

            for (let j = 0; j < prefixLength; j++) {
                if (P[j] !== P[m - prefixLength + j]) {
                    same = false;
                    break;
                }
            }

            if (same) {
                break;
            }

            prefixLength--;
        }

        d2[k] = m - prefixLength;
    }

    return d2;
}

function boyerMoore(T, P) {
    const n = T.length;
    const m = P.length;

    if (m === 0) {
        alignments++;
        return 0;
    }

    const t1 = shiftTable(P);
    const d2 = goodSuffixTable(P);
    let i = m - 1;

    while (i <= n - 1) {
        alignments++;
        let k = 0;

        while (k <= m - 1) {
            comparisons++;

            if (P[m - 1 - k] !== T[i - k]) {
                break;
            }

            k++;
        }

        if (k === m) {
            return i - m + 1;
        }

        const c = T[i - k];
        const badCharacterShift = Math.max(shift(t1, c, m) - k, 1);

        if (k === 0) {
            i += badCharacterShift;
        } else {
            i += Math.max(badCharacterShift, d2[k]);
        }
    }

    return -1;
}

module.exports = {
    bruteForce, shiftTable, horspool, horspool2,
    findAll, highlight, goodSuffixTable, boyerMoore, resetCounters, getCounters,
};
