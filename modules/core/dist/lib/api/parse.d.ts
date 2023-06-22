import type { DataType, Loader, LoaderContext, LoaderOptions } from '@loaders.gl/loader-utils';
import type { LoaderOptionsType, LoaderReturnType } from '@loaders.gl/loader-utils';
export declare function parse<LoaderT extends Loader, OptionsT extends LoaderOptions = LoaderOptionsType<LoaderT>>(data: DataType | Promise<DataType>, loader: LoaderT, options?: OptionsT, context?: LoaderContext): Promise<LoaderReturnType<LoaderT>>;
export declare function parse(data: DataType | Promise<DataType>, loaders: Loader[], options?: LoaderOptions, context?: LoaderContext): Promise<any>;
export declare function parse(data: DataType | Promise<DataType>, options?: LoaderOptions): Promise<any>;
//# sourceMappingURL=parse.d.ts.map