// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {load, encode} from '@sensat/loaders-gl-core';
import {ImageLoader} from '@sensat/loaders-gl-images';
import {BasisLoader, KTX2BasisWriter, KTX2BasisWriterWorker} from '@sensat/loaders-gl-textures';
import {isBrowser, processOnWorker, WorkerFarm} from '@sensat/loaders-gl-worker-utils';

const shannonPNG = '@sensat/loaders-gl-textures/test/data/shannon.png';
const shannonJPG = '@sensat/loaders-gl-textures/test/data/shannon.jpg';

test('KTX2BasisUniversalTextureWriter#Should encode PNG', async (t) => {
  const image = await load(shannonPNG, ImageLoader, {image: {type: 'data'}});
  const encodedData = await encode(image, KTX2BasisWriter);
  const transcodedImages = await load(encodedData, BasisLoader);
  const transcodedImage = transcodedImages[0][0];

  t.ok(encodedData);
  t.ok(transcodedImage);
  t.equal(image.height, transcodedImage.height);
  t.equal(image.width, transcodedImage.width);

  t.end();
});

test('KTX2BasisUniversalTextureWriter # Worker # Should encode PNG', async (t) => {
  const image = await load(shannonPNG, ImageLoader, {image: {type: 'data'}});
  const encodedData = await processOnWorker(KTX2BasisWriterWorker, image, {
    _workerType: 'test'
  });
  const transcodedImages = await load(encodedData, BasisLoader);
  const transcodedImage = transcodedImages[0][0];

  t.ok(encodedData);
  t.ok(transcodedImage);
  t.equal(image.height, transcodedImage.height);
  t.equal(image.width, transcodedImage.width);

  if (!isBrowser) {
    const workerFarm = WorkerFarm.getWorkerFarm({});
    workerFarm.destroy();
  }

  t.end();
});

test('KTX2BasisUniversalTextureWriter#Should encode JPG', async (t) => {
  const image = await load(shannonJPG, ImageLoader, {image: {type: 'data'}});
  const encodedData = await encode(image, KTX2BasisWriter);
  const transcodedImages = await load(encodedData, BasisLoader);
  const transcodedImage = transcodedImages[0][0];

  t.ok(encodedData);
  t.ok(transcodedImage);
  t.equal(image.height, transcodedImage.height);
  t.equal(image.width, transcodedImage.width);

  t.end();
});
