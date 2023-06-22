export function getLabels(dimOrder) {
  return dimOrder.toLowerCase().split('').reverse();
}
export function getDims(labels) {
  const lookup = new Map(labels.map((name, i) => [name, i]));
  if (lookup.size !== labels.length) {
    throw Error('Labels must be unique, found duplicated label.');
  }
  return name => {
    const index = lookup.get(name);
    if (index === undefined) {
      throw Error('Invalid dimension.');
    }
    return index;
  };
}
//# sourceMappingURL=utils.js.map