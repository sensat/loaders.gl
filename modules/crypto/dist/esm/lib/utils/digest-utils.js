import { toBase64 } from './base64-utils';
export function toHex(cipher) {
  const hexString = cipher.toString(16);
  return hexString === '0' ? "0".concat(hexString) : hexString;
}
export function hexToBase64(hexstring) {
  if (hexstring.length % 2 !== 0) {
    hexstring = "0".concat(hexstring);
  }
  const matches = hexstring.match(/\w{2}/g) || [];
  const string = matches.map(a => String.fromCharCode(parseInt(a, 16))).join('');
  return toBase64(string) || '';
}
//# sourceMappingURL=digest-utils.js.map