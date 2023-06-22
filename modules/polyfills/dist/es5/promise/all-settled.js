"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REJECTED_STATUS = exports.FULFILLED_STATUS = void 0;
exports.allSettled = allSettled;
var REJECTED_STATUS = 'rejected';
exports.REJECTED_STATUS = REJECTED_STATUS;
var FULFILLED_STATUS = 'fulfilled';
exports.FULFILLED_STATUS = FULFILLED_STATUS;
function allSettled(promises) {
  var mappedPromises = promises.map(function (promise) {
    return promise.then(function (value) {
      return {
        status: FULFILLED_STATUS,
        value: value
      };
    }).catch(function (reason) {
      return {
        status: REJECTED_STATUS,
        reason: reason
      };
    });
  });
  return Promise.all(mappedPromises);
}
//# sourceMappingURL=all-settled.js.map