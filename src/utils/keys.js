
export function findAvailableKey(root, keys){
  // eslint-disable-next-line no-sequences
  let keys_index = keys.reduce((r, i) => (r[i] = true, r), {})

  let next = root;
  let index = 1;

  // check if this pattern already exists, so we don't chain key_2_2_2 etc
  let endsInNumber = /_(\d+)$/g;
  let matches = endsInNumber.exec(root);
  if(matches && matches.length > 1){
    index = parseInt(matches[1]);
    root = next = next.replace(matches[0], "");
  }

  while(keys_index[next]){
    index++;
    next = root + "_" + index;
  }

  return next;
}

export function createSafeKeyFromName(name){
  return name.replace(/[^A-Z0-9]/ig, "_");
}
