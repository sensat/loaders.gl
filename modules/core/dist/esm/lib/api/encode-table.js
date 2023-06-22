import { concatenateArrayBuffers } from '@loaders.gl/loader-utils';
export async function encodeTable(data, writer, options) {
  if (writer.encode) {
    return await writer.encode(data, options);
  }
  if (writer.encodeText) {
    const text = await writer.encodeText(data, options);
    return new TextEncoder().encode(text);
  }
  if (writer.encodeInBatches) {
    const batches = encodeTableInBatches(data, writer, options);
    const chunks = [];
    for await (const batch of batches) {
      chunks.push(batch);
    }
    return concatenateArrayBuffers(...chunks);
  }
  throw new Error('Writer could not encode data');
}
export async function encodeTableAsText(data, writer, options) {
  if (writer.text && writer.encodeText) {
    return await writer.encodeText(data, options);
  }
  if (writer.text && (writer.encode || writer.encodeInBatches)) {
    const arrayBuffer = await encodeTable(data, writer, options);
    return new TextDecoder().decode(arrayBuffer);
  }
  throw new Error('Writer could not encode data as text');
}
export function encodeTableInBatches(data, writer, options) {
  if (writer.encodeInBatches) {
    const dataIterator = getIterator(data);
    return writer.encodeInBatches(dataIterator, options);
  }
  throw new Error('Writer could not encode data in batches');
}
function getIterator(data) {
  const dataIterator = [{
    table: data,
    start: 0,
    end: data.length
  }];
  return dataIterator;
}
//# sourceMappingURL=encode-table.js.map