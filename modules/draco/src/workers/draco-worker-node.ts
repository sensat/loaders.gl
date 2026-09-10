// Polyfills increases the bundle size significantly. Use it for NodeJS worker only
import '@sensat/loaders-gl-polyfills';
import {createLoaderWorker} from '@sensat/loaders-gl-loader-utils';
import {DracoLoader} from '../index';

createLoaderWorker(DracoLoader);
