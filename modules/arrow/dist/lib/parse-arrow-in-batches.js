"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArrowInBatches = void 0;
// TODO - this import defeats the sophisticated typescript checking in ArrowJS
const apache_arrow_1 = require("apache-arrow");
// import {isIterable} from '@loaders.gl/core';
/**
 */
function parseArrowInBatches(asyncIterator) {
    // Creates the appropriate RecordBatchReader subclasses from the input
    // This will also close the underlying source in case of early termination or errors
    // As an optimization, return a non-async iterator
    /*
    if (isIterable(readers)) {
      function* makeArrowIterator() {
        for (const reader of readers) {
          for (const batch of reader) {
            yield processBatch(batch, reader);
          }
          break; // only processing one stream of batches
        }
      }
      const arrowIterator = makeArrowIterator();
    }
    */
    async function* makeArrowAsyncIterator() {
        const readers = apache_arrow_1.RecordBatchReader.readAll(asyncIterator);
        for await (const reader of readers) {
            for await (const batch of reader) {
                yield processBatch(batch);
            }
            break; // only processing one stream of batches
        }
    }
    return makeArrowAsyncIterator();
}
exports.parseArrowInBatches = parseArrowInBatches;
function processBatch(batch) {
    const values = {
        metadata: batch.schema.metadata,
        length: batch.length
    };
    batch.schema.fields.forEach(({ name }, index) => {
        values[name] = batch.getChildAt(index).toArray();
    });
    return values;
}
