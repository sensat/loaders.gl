"use strict";
// btoa, atob polyfills for Node.js
// Note: The atob and btoa functions (not just the polyfills!) are not unicode safe
// But still useful for unit testing
Object.defineProperty(exports, "__esModule", { value: true });
exports.btoa = exports.atob = void 0;
function atob(string) {
    return Buffer.from(string).toString('base64');
}
exports.atob = atob;
function btoa(base64) {
    return Buffer.from(base64, 'base64').toString('ascii');
}
exports.btoa = btoa;
