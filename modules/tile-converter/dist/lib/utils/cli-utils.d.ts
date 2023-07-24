/**
 * Get string option value from cli arguments
 * @param index - option's name index in the argument's array.
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - string value of the option
 */
export declare function getStringValue(index: number, args: string[]): string;
/**
 * Modyfy URL path to be compatible with fetch
 * @param index - option's name index in the argument's array.
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - string value of the option
 */
export declare function getURLValue(index: number, args: string[]): string;
export declare function validateOptionsWithEqual(args: string[]): string[];
/**
 * Get integer option value from cli arguments
 * @param index - option's name index in the argument's array
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - number value of the option
 */
export declare function getIntegerValue(index: number, args: string[]): number;
/**
 * Get boolean option value from cli arguments
 * @param index - option's name index in the argument's array
 *                The value of the option should be next to name of the option.
 * @param args - cli arguments array
 * @returns - boolean value of the option
 */
export declare function getBooleanValue(index: number, args: string[]): boolean;
//# sourceMappingURL=cli-utils.d.ts.map