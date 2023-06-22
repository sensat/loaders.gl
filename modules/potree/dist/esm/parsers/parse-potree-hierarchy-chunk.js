export default function parsePotreeHierarchyChunk(arrayBuffer) {
  const tileHeaders = parseBinaryChunk(arrayBuffer);
  return buildHierarchy(tileHeaders);
}
function parseBinaryChunk(arrayBuffer) {
  let byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const dataView = new DataView(arrayBuffer);
  const stack = [];
  const topTileHeader = {};
  byteOffset = decodeRow(dataView, byteOffset, topTileHeader);
  stack.push(topTileHeader);
  const tileHeaders = [];
  while (stack.length > 0) {
    const snode = stack.shift();
    let mask = 1;
    for (let i = 0; i < 8; i++) {
      if (snode && (snode.header.childMask & mask) !== 0) {
        const tileHeader = {};
        byteOffset = decodeRow(dataView, byteOffset, tileHeader);
        tileHeader.name = snode.name + i;
        stack.push(tileHeader);
        tileHeaders.push(tileHeader);
        snode.header.childCount++;
      }
      mask = mask * 2;
    }
    if (byteOffset === dataView.byteLength) {
      break;
    }
  }
  return tileHeaders;
}
function decodeRow(dataView, byteOffset, tileHeader) {
  tileHeader.header = tileHeader.header || {};
  tileHeader.header.childMask = dataView.getUint8(byteOffset);
  tileHeader.header.childCount = 0;
  tileHeader.pointCount = dataView.getUint32(byteOffset + 1, true);
  tileHeader.name = '';
  byteOffset += 5;
  return byteOffset;
}
function buildHierarchy(tileHeaders) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const DEFAULT_OPTIONS = {
    spacing: 100
  };
  options = {
    ...DEFAULT_OPTIONS,
    ...options
  };
  const topNode = tileHeaders[0];
  const nodes = {};
  for (const tileHeader of tileHeaders) {
    const {
      name
    } = tileHeader;
    const index = parseInt(name.charAt(name.length - 1), 10);
    const parentName = name.substring(0, name.length - 1);
    const parentNode = nodes[parentName];
    const level = name.length - 1;
    tileHeader.level = level;
    tileHeader.hasChildren = tileHeader.header.childCount;
    tileHeader.children = [];
    tileHeader.childrenByIndex = new Array(8).fill(null);
    tileHeader.spacing = options.spacing / Math.pow(2, level);
    if (parentNode) {
      parentNode.children.push(tileHeader);
      parentNode.childrenByIndex[index] = tileHeader;
    }
    nodes[name] = tileHeader;
  }
  return topNode;
}
//# sourceMappingURL=parse-potree-hierarchy-chunk.js.map