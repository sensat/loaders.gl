"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSettled = exports.FULFILLED_STATUS = exports.REJECTED_STATUS = void 0;
exports.REJECTED_STATUS = 'rejected';
exports.FULFILLED_STATUS = 'fulfilled';
/**
 * Handle list of promises and return all values regardless of results.
 * Polyfill for Promise.allSettled() method.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
 * @param promises
 */
function allSettled(promises) {
    const mappedPromises = promises.map((promise) => {
        return promise
            .then((value) => {
            return { status: exports.FULFILLED_STATUS, value };
        })
            .catch((reason) => {
            return { status: exports.REJECTED_STATUS, reason };
        });
    });
    return Promise.all(mappedPromises);
}
exports.allSettled = allSettled;
