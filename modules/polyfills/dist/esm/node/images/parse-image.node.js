import getPixels from 'get-pixels';
export const NODE_FORMAT_SUPPORT = ['image/png', 'image/jpeg', 'image/gif'];
export async function parseImageNode(arrayBuffer, mimeType) {
  if (!mimeType) {
    throw new Error('MIMEType is required to parse image under Node.js');
  }
  const buffer = arrayBuffer instanceof Buffer ? arrayBuffer : Buffer.from(arrayBuffer);
  const ndarray = await getPixelsAsync(buffer, mimeType);
  return ndarray;
}
function getPixelsAsync(buffer, mimeType) {
  return new Promise(resolve => getPixels(buffer, mimeType, (err, ndarray) => {
    if (err) {
      throw err;
    }
    const shape = [...ndarray.shape];
    const layers = ndarray.shape.length === 4 ? ndarray.shape.shift() : 1;
    const data = ndarray.data instanceof Buffer ? new Uint8Array(ndarray.data) : ndarray.data;
    resolve({
      shape,
      data,
      width: ndarray.shape[0],
      height: ndarray.shape[1],
      components: ndarray.shape[2],
      layers: layers ? [layers] : []
    });
  }));
}
//# sourceMappingURL=parse-image.node.js.map