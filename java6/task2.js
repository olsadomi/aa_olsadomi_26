const DELETED = Symbol("deleted");

function num(key) {
  if (typeof key === "number") return key;

  let sum = 0;
  for (const character of key) {
    sum += character.charCodeAt(0) - 64;
  }
  return sum;
}

function h(key, m) {
  return num(key) % m;
}

function chainedTable(keys, m) {
  const table = [];

  for (let i = 0; i < m; i++) {
    table.push([]);
  }

  for (const key of keys) {
    table[h(key, m)].push(key);
  }

  return table;
}

function probeInsert(table, key) {
  const m = table.length;
  let i = h(key, m);

  while (table[i] !== null) {
    i = (i + 1) % m;
  }

  table[i] = key;
  return i;
}

function probeFind(table, key) {
  const m = table.length;
  let i = h(key, m);

  while (table[i] !== null) {
    if (table[i] === key) return i;
    i = (i + 1) % m;
  }

  return -1;
}

function probeRemove(table, key) {
  const m = table.length;
  let i = h(key, m);

  while (table[i] !== null) {
    if (table[i] === key) {
      table[i] = null;
      return i;
    }

    i = (i + 1) % m;
  }

  return -1;
}

function remove(table, key) {
  const m = table.length;
  let i = h(key, m);

  while (table[i] !== null) {
    if (table[i] === key) {
      table[i] = DELETED;
      return i;
    }

    i = (i + 1) % m;
  }

  return -1;
}

function doubleHashInsert(table, key) {
  const m = table.length;
  let i = h(key, m);
  const step = m - 2 - (num(key) % (m - 2));

  while (table[i] !== null) {
    i = (i + step) % m;
  }

  table[i] = key;
  return i;
}

function doubleHashFind(table, key) {
  const m = table.length;
  let i = h(key, m);
  const step = m - 2 - (num(key) % (m - 2));

  while (table[i] !== null) {
    if (table[i] === key) return i;
    i = (i + step) % m;
  }

  return -1;
}

function maxComparisons(keys, m) {
  const chainedHashTable = chainedTable(keys, m);
  const linearTable = new Array(m).fill(null);
  const doubleHashTable = new Array(m).fill(null);

  for (const key of keys) {
    probeInsert(linearTable, key);
    doubleHashInsert(doubleHashTable, key);
  }

  let chained = 0;
  for (const list of chainedHashTable) {
    if (list.length > chained) chained = list.length;
  }

  let linear = 0;
  let double = 0;

  for (const key of keys) {
    let comparisons = 1;
    let i = h(key, m);

    while (linearTable[i] !== key) {
      comparisons++;
      i = (i + 1) % m;
    }

    if (comparisons > linear) linear = comparisons;

    comparisons = 1;
    i = h(key, m);
    const step = m - 2 - (num(key) % (m - 2));

    while (doubleHashTable[i] !== key) {
      comparisons++;
      i = (i + step) % m;
    }

    if (comparisons > double) double = comparisons;
  }

  return { chained, linear, double };
}

function nextPrime(n) {
  function isPrime(value) {
    if (value < 2) return false;

    for (let divisor = 2; divisor * divisor <= value; divisor++) {
      if (value % divisor === 0) return false;
    }

    return true;
  }

  while (!isPrime(n)) n++;
  return n;
}

function insertGrow(table, key) {
  const m = table.length;
  let numberOfKeys = 0;

  for (const cell of table) {
    if (cell !== null && cell !== DELETED) numberOfKeys++;
  }

  if ((numberOfKeys + 1) / m > 0.5) {
    const newTable = new Array(nextPrime(2 * m)).fill(null);

    for (const oldKey of table) {
      if (oldKey !== null && oldKey !== DELETED) {
        probeInsert(newTable, oldKey);
      }
    }

    table = newTable;
  }

  probeInsert(table, key);
  return table;
}

module.exports = {
  num,
  h,
  chainedTable,
  probeInsert,
  probeFind,
  probeRemove,
  DELETED,
  remove,
  doubleHashInsert,
  doubleHashFind,
  maxComparisons,
  insertGrow,
};


//Unlike null, DELETED does not stop the search, so "SOON" remains findable.

//maxComparisons(N, 11);
// { chained: 3, linear: 6, double: 2 }

// maxComparisons(W, 13);
// { chained: 2, linear: 2, double: 3 }
