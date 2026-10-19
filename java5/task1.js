/**
 * Finds the first occurrence of pattern P in text T by checking every
 * possible alignment from left to right.
 *
 * @param {string} T text to search
 * @param {string} P pattern to find
 * @returns {number} starting index of the first match, or -1
 */
function bruteForce(T, P) {
    const n = T.length;
    const m = P.length;

    for (let i = 0; i <= n - m; i++) {
        let j = 0;

        while (j < m && P[j] === T[i + j]) {
            j++;
        }

        if (j === m) {
            return i;
        }
    }

    return -1;
}

/**
 * Builds Horspool's shift table. The pattern's last character is excluded.
 * If a character occurs more than once, its rightmost relevant occurrence
 * determines the shift because Map#set overwrites the earlier value.
 *
 * @param {string} P pattern
 * @returns {Map<string, number>} character-to-shift mapping
 */
function shiftTable(P) {
    const m = P.length;
    const table = new Map();

    for (let j = 0; j < m - 1; j++) {
        table.set(P[j], m - 1 - j);
    }

    return table;
}

/**
 * Returns the stored shift for c, or the full pattern length when c does
 * not occur before the pattern's last character.
 */
function shift(table, c, m) {
    return table.has(c) ? table.get(c) : m;
}

/**
 * Finds the first occurrence of P in T with Horspool's algorithm.
 * Characters are compared from right to left.
 *
 * @param {string} T text to search
 * @param {string} P pattern to find
 * @returns {number} starting index of the first match, or -1
 */
function horspool(T, P) {
    const n = T.length;
    const m = P.length;

    if (m === 0) {
        return 0;
    }

    const table = shiftTable(P);
    let i = m - 1;

    while (i <= n - 1) {
        let k = 0;

        while (k <= m - 1 && P[m - 1 - k] === T[i - k]) {
            k++;
        }

        if (k === m) {
            return i - m + 1;
        }

        i += shift(table, T[i], m);
    }

    return -1;
}

/**
 * Horspool variant from the lecture slide. Unlike horspool(), the next
 * shift is based on the text character where the mismatch occurred.
 *
 * @param {string} T text to search
 * @param {string} P pattern to find
 * @returns {number} starting index of the first match, or -1
 */
function horspool2(T, P) {
    const n = T.length;
    const m = P.length;

    if (m === 0) {
        return 0;
    }

    const table = shiftTable(P);
    let i = m - 1;

    while (i <= n - 1) {
        let k = 0;

        while (k <= m - 1 && P[m - 1 - k] === T[i - k]) {
            k++;
        }

        if (k === m) {
            return i - m + 1;
        }

        i += shift(table, T[i - k], m);
    }

    return -1;
}

if (typeof module !== "undefined") {
    module.exports = {
        bruteForce,
        shiftTable,
        shift,
        horspool,
        horspool2
    };
}
