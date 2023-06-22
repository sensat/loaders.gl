import { isBlob } from '../../javascript-utils/is-type';
import { isLoaderObject } from '../loader-utils/normalize-loader';
import { getFetchFunction } from '../loader-utils/get-fetch-function';
import { parse } from './parse';
export async function load(url, loaders, options, context) {
  let resolvedLoaders;
  let resolvedOptions;
  if (!Array.isArray(loaders) && !isLoaderObject(loaders)) {
    resolvedLoaders = [];
    resolvedOptions = loaders;
    context = undefined;
  } else {
    resolvedLoaders = loaders;
    resolvedOptions = options;
  }
  const fetch = getFetchFunction(resolvedOptions);
  let data = url;
  if (typeof url === 'string') {
    data = await fetch(url);
  }
  if (isBlob(url)) {
    data = await fetch(url);
  }
  return Array.isArray(resolvedLoaders) ? await parse(data, resolvedLoaders, resolvedOptions) : await parse(data, resolvedLoaders, resolvedOptions);
}
//# sourceMappingURL=load.js.map