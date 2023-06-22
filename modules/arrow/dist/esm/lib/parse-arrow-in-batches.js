import { RecordBatchReader } from 'apache-arrow';
export function parseArrowInBatches(asyncIterator) {
  async function* makeArrowAsyncIterator() {
    const readers = RecordBatchReader.readAll(asyncIterator);
    for await (const reader of readers) {
      for await (const batch of reader) {
        yield processBatch(batch);
      }
      break;
    }
  }
  return makeArrowAsyncIterator();
}
function processBatch(batch) {
  const values = {
    metadata: batch.schema.metadata,
    length: batch.length
  };
  batch.schema.fields.forEach((_ref, index) => {
    let {
      name
    } = _ref;
    values[name] = batch.getChildAt(index).toArray();
  });
  return values;
}
//# sourceMappingURL=parse-arrow-in-batches.js.map