"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDims = getDims;
exports.getLabels = getLabels;
function getLabels(dimOrder) {
  return dimOrder.toLowerCase().split('').reverse();
}
function getDims(labels) {
  var lookup = new Map(labels.map(function (name, i) {
    return [name, i];
  }));
  if (lookup.size !== labels.length) {
    throw Error('Labels must be unique, found duplicated label.');
  }
  return function (name) {
    var index = lookup.get(name);
    if (index === undefined) {
      throw Error('Invalid dimension.');
    }
    return index;
  };
}
//# sourceMappingURL=utils.js.map