export const REJECTED_STATUS = 'rejected';
export const FULFILLED_STATUS = 'fulfilled';
export function allSettled(promises) {
  const mappedPromises = promises.map(promise => {
    return promise.then(value => {
      return {
        status: FULFILLED_STATUS,
        value
      };
    }).catch(reason => {
      return {
        status: REJECTED_STATUS,
        reason
      };
    });
  });
  return Promise.all(mappedPromises);
}
//# sourceMappingURL=all-settled.js.map