
export function findAvailableKey(root, keys){
  let keys_index = keys.reduce((r, i) => (r[i] = true, r), {})
  let next = root;
  let index = 1;
  while(keys_index[next]){
    index++;
    next = root + "_" + index;
  }

  return next;
}

export function createSafeKeyFromName(name){
  return name.replace(/[^A-Z0-9]/ig, "_").toLowerCase();
}
