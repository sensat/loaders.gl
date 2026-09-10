// Polyfills increases the bundle size significantly. Use it for NodeJS worker only
import '@sensat/loaders-gl-polyfills';
import {createLoaderWorker} from '@sensat/loaders-gl-loader-utils';
import {I3SContentLoader} from '../i3s-content-loader';

createLoaderWorker(I3SContentLoader);
