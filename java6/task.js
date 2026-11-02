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

module.exports = {
  num,
  h,
  chainedTable,
  probeInsert,
  probeFind,
  probeRemove,
};



//notes 
// | Call | Predicted | Real |
// |---|---:|---:|
// | `chainedTable(W, 13)[11]` | `["ARE", "SOON"]` | `["ARE", "SOON"]` |
// | `probeFind(T, "PARTED")` | `0` | `0` |
// | `probeFind(T, "KID")` | `-1` | `-1` |
// | `probeRemove(T, "ARE")` | `11` | `11` |
// | `probeFind(T, "SOON")` | `-1` | `-1` |


// //SOON still exists at index 12, but searching returns -1 because removing
// ARE placed null at index 11. probeFind stops when it reaches that null.
//simply replacing a deleted element with null can break linear probing.  