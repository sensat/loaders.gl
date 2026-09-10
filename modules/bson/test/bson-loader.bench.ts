// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {BSONLoader} from '@sensat/loaders-gl-bson';
import {load} from '@sensat/loaders-gl-core';

const TAGS_BSON_URL = '@sensat/loaders-gl-bson/test/data/js-bson/mongodump.airpair.tags.bson';

export default async function bsonLoaderBench(suite) {
  suite.group('BSONLoader');

  const options = {multiplier: 308, unit: 'features'};

  suite.addAsync('load(BSONLoader) - Atomic GeoBSON load (BSON.parse)', options, async () => {
    await load(TAGS_BSON_URL, BSONLoader);
  });
}
