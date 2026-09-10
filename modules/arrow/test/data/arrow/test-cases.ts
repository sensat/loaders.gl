// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

// Small Arrow Sample Files
export const ARROW_SIMPLE = '@sensat/loaders-gl-arrow/test/data/arrow/simple.arrow';
export const ARROW_DICTIONARY = '@sensat/loaders-gl-arrow/test/data/arrow/dictionary.arrow';
export const ARROW_STRUCT = '@sensat/loaders-gl-arrow/test/data/arrow/struct.arrow';

// Bigger, batched sample file
export const ARROW_BIOGRID_NODES = '@sensat/loaders-gl-arrow/test/data/arrow/biogrid-nodes.arrow';

export const ARROW_TEST_CASES = [
  {
    title: 'simple.arrow',
    filename: ARROW_SIMPLE
  },
  // {
  //   title: 'dictionary.arrow',
  //   filename: ARROW_DICTIONARY
  // },
  {
    title: 'struct.arrow',
    filename: ARROW_STRUCT
  },
  {
    title: 'biogrid-nodes.arrow',
    filename: ARROW_BIOGRID_NODES
  }
] as const;
