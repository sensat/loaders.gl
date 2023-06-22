import type { DataType, Loader, LoaderContext, LoaderOptions } from '@loaders.gl/loader-utils';
import type { LoaderOptionsType, LoaderReturnType } from '@loaders.gl/loader-utils';
/**
 * Parses `data` using a specified loader
 * Note: Load does duplicate a lot of parse.
 * it can also call fetchFile on string urls, which `parse` won't do.
 * @param data
 * @param loaders
 * @param options
 * @param context
 */
export declare function load<LoaderT extends Loader>(url: string | DataType, loader: LoaderT, options?: LoaderOptionsType<LoaderT>, context?: LoaderContext): Promise<LoaderReturnType<LoaderT>>;
export declare function load<LoaderT extends Loader, // eslint-disable-line  @typescript-eslint/no-unused-vars
LoaderOptionsT extends LoaderOptions = LoaderOptions>(url: string | DataType, loaders: Loader[] | LoaderOptions, options?: LoaderOptionsT, context?: LoaderContext): Promise<any>;
//# sourceMappingURL=load.d.ts.map