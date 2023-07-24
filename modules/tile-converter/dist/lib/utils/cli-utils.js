"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooleanValue = exports.getIntegerValue = exports.validateOptionsWithEqual = exports.getURLValue = exports.getStringValue = void 0;
/**
 * Get string option value from cli arguments
 * @param index - option's name index in the argument's array.
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - string value of the option
 */
function getStringValue(index, args) {
    if (index + 1 >= args.length) {
        return '';
    }
    const value = args[index + 1];
    if (value.indexOf('--') === 0) {
        return '';
    }
    return value;
}
exports.getStringValue = getStringValue;
/**
 * Modyfy URL path to be compatible with fetch
 * @param index - option's name index in the argument's array.
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - string value of the option
 */
function getURLValue(index, args) {
    const value = getStringValue(index, args);
    console.log(`Input tileset value: ${value}`);
    console.log(`Modified tileset value: ${value.replace(/\\/g, '/')}`);
    return value.replace(/\\/g, '/');
}
exports.getURLValue = getURLValue;
function validateOptionsWithEqual(args) {
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
exports.validateOptionsWithEqual = validateOptionsWithEqual;
/**
 * Get integer option value from cli arguments
 * @param index - option's name index in the argument's array
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - number value of the option
 */
function getIntegerValue(index, args) {
    const stringValue = getStringValue(index, args);
    const result = Number.parseInt(stringValue);
    if (isFinite(result)) {
        return result;
    }
    return NaN;
}
exports.getIntegerValue = getIntegerValue;
/**
 * Get boolean option value from cli arguments
 * @param index - option's name index in the argument's array
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - boolean value of the option
 */
function getBooleanValue(index, args) {
    const stringValue = getStringValue(index, args).toLowerCase().trim();
    if (['--no-draco', '--split-nodes'].includes(args[index]) && !stringValue) {
        return false;
    }
    if (!stringValue || stringValue === 'true') {
        return true;
    }
    return false;
}
exports.getBooleanValue = getBooleanValue;
