// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Polyfills increases the bundle size significantly. Use it for NodeJS worker only
import '@sensat/loaders-gl-polyfills';
import {createLoaderWorker} from '@sensat/loaders-gl-loader-utils';
import {BasisLoader} from '../basis-loader';

createLoaderWorker(BasisLoader);
