// Converts strings that contain numbers or booleans into their corresponding type
// because that is what GMF expects

export function normalizeType(value){
  if(typeof value !== 'string'){
    return value;
  }
  value = value.trim();
  if(/^-?\d*[\.]?\d+$/.test(value) && (parseFloat(value) || parseFloat(value) === 0)){
    value = parseFloat(value);
  }
  if(/^(true|false)$/i.test(value)){
    value = value.toLowerCase() === 'true';
  }
  return value
}

export function cleanString(value, mapObj){
  return Object.keys(mapObj).reduce( (acc, cur) => acc.split(cur).join(mapObj[cur]), value)
}
