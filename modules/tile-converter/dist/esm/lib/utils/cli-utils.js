export function getStringValue(index, args) {
  if (index + 1 >= args.length) {
    return '';
  }
  const value = args[index + 1];
  if (value.indexOf('--') === 0) {
    return '';
  }
  return value;
}
export function getURLValue(index, args) {
  const value = getStringValue(index, args);
  console.log("Input tileset value: ".concat(value));
  console.log("Modified tileset value: ".concat(value.replace(/\\/g, '/')));
  return value.replace(/\\/g, '/');
}
export function validateOptionsWithEqual(args) {
  return args.reduce((acc, curr) => {
    const equalSignIndex = curr.indexOf('=');
    const beforeEqual = curr.slice(0, equalSignIndex);
    const afterEqual = curr.slice(equalSignIndex + 1, curr.length);
    const condition = curr.includes('=') && curr.startsWith('--') && afterEqual;
    if (condition) {
      return acc.concat(beforeEqual, afterEqual);
    }
    return acc.concat(curr);
  }, []);
}
export function getIntegerValue(index, args) {
  const stringValue = getStringValue(index, args);
  const result = Number.parseInt(stringValue);
  if (isFinite(result)) {
    return result;
  }
  return NaN;
}
export function getBooleanValue(index, args) {
  const stringValue = getStringValue(index, args).toLowerCase().trim();
  if (['--no-draco', '--split-nodes'].includes(args[index]) && !stringValue) {
    return false;
  }
  if (!stringValue || stringValue === 'true') {
    return true;
  }
  return false;
}
//# sourceMappingURL=cli-utils.js.map