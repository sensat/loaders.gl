export declare const REJECTED_STATUS = "rejected";
export declare const FULFILLED_STATUS = "fulfilled";
/**
 * Handle list of promises and return all values regardless of results.
 * Polyfill for Promise.allSettled() method.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
 * @param promises
 */
export declare function allSettled(promises: Promise<any>[]): Promise<any>;
//# sourceMappingURL=all-settled.d.ts.map