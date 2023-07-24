"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBooleanValue = getBooleanValue;
exports.getIntegerValue = getIntegerValue;
exports.getStringValue = getStringValue;
exports.getURLValue = getURLValue;
exports.validateOptionsWithEqual = validateOptionsWithEqual;
function getStringValue(index, args) {
  if (index + 1 >= args.length) {
    return '';
  }
  var value = args[index + 1];
  if (value.indexOf('--') === 0) {
    return '';
  }
  return value;
}
function getURLValue(index, args) {
  var value = getStringValue(index, args);
  console.log("Input tileset value: ".concat(value));
  console.log("Modified tileset value: ".concat(value.replace(/\\/g, '/')));
  return value.replace(/\\/g, '/');
}
function validateOptionsWithEqual(args) {
  return args.reduce(function (acc, curr) {
    var equalSignIndex = curr.indexOf('=');
    var beforeEqual = curr.slice(0, equalSignIndex);
    var afterEqual = curr.slice(equalSignIndex + 1, curr.length);
    var condition = curr.includes('=') && curr.startsWith('--') && afterEqual;
    if (condition) {
      return acc.concat(beforeEqual, afterEqual);
    }
    return acc.concat(curr);
  }, []);
}
function getIntegerValue(index, args) {
  var stringValue = getStringValue(index, args);
  var result = Number.parseInt(stringValue);
  if (isFinite(result)) {
    return result;
  }
  return NaN;
}
function getBooleanValue(index, args) {
  var stringValue = getStringValue(index, args).toLowerCase().trim();
  if (['--no-draco', '--split-nodes'].includes(args[index]) && !stringValue) {
    return false;
  }
  if (!stringValue || stringValue === 'true') {
    return true;
  }
  return false;
}
//# sourceMappingURL=cli-utils.js.map