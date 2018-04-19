// Converts strings that contain numbers or booleans into their corresponding type
// because that is what GMF expects

export function normalizeType(value){
  if(typeof value !== 'string'){
    return value;
  }
  value = value.trim();
  if(/^[0-9.\-]+$/.test(value) && (parseFloat(value) || parseFloat(value) === 0)){
    value = parseFloat(value);
  }
  if(/^(true|false)$/i.test(value)){
    value = value.toLowerCase() === 'true';
  }
  return value
}
