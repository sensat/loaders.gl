/**
 * Polyfill for Browser Headers
 * Based on https://github.com/github/fetch under MIT license
 */
export declare class Headers {
    map: {};
    constructor(headers: any);
    append(name: any, value: any): void;
    delete(name: any): void;
    get(name: any): any;
    has(name: any): boolean;
    set(name: any, value: any): void;
    forEach(visitor: any, thisArg?: null): void;
    keys(): {
        next(): {
            done: boolean;
            value: any;
        };
    };
    values(): {
        next(): {
            done: boolean;
            value: any;
        };
    };
    entries(): {
        next(): {
            done: boolean;
            value: any;
        };
    };
    [Symbol.iterator](): Generator<any, void, unknown>;
}
//# sourceMappingURL=headers.node.d.ts.map