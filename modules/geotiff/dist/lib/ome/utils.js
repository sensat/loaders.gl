"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDims = exports.getLabels = void 0;
function getLabels(dimOrder) {
    return dimOrder.toLowerCase().split('').reverse();
}
exports.getLabels = getLabels;
/*
 * Creates an ES6 map of 'label' -> index
 * > const labels = ['a', 'b', 'c', 'd'];
 * > const dims = getDims(labels);
 * > dims('a') === 0;
 * > dims('b') === 1;
 * > dims('c') === 2;
 * > dims('hi!'); // throws
 */
function getDims(labels) {
    const lookup = new Map(labels.map((name, i) => [name, i]));
    if (lookup.size !== labels.length) {
        throw Error('Labels must be unique, found duplicated label.');
    }
    return (name) => {
        const index = lookup.get(name);
        if (index === undefined) {
            throw Error('Invalid dimension.');
        }
        return index;
    };
}
exports.getDims = getDims;
