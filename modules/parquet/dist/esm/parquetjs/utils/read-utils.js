import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { TBufferedTransport, TCompactProtocol, TFramedTransport } from 'thrift';
import { FileMetaData, PageHeader } from '../parquet-thrift';
class UFramedTransport extends TFramedTransport {
  constructor() {
    super(...arguments);
    _defineProperty(this, "readPos", 0);
  }
}
export function serializeThrift(obj) {
  const output = [];
  const transport = new TBufferedTransport(undefined, buf => {
    output.push(buf);
  });
  const protocol = new TCompactProtocol(transport);
  obj.write(protocol);
  transport.flush();
  return Buffer.concat(output);
}
export function decodeThrift(obj, buf, offset) {
  if (!offset) {
    offset = 0;
  }
  const transport = new UFramedTransport(buf);
  transport.readPos = offset;
  const protocol = new TCompactProtocol(transport);
  obj.read(protocol);
  return transport.readPos - offset;
}
export function getThriftEnum(klass, value) {
  for (const k in klass) {
    if (klass[k] === value) {
      return k;
    }
  }
  throw new Error('Invalid ENUM value');
}
export function decodeFileMetadata(buf, offset) {
  if (!offset) {
    offset = 0;
  }
  const transport = new UFramedTransport(buf);
  transport.readPos = offset;
  const protocol = new TCompactProtocol(transport);
  const metadata = FileMetaData.read(protocol);
  return {
    length: transport.readPos - offset,
    metadata
  };
}
export function decodePageHeader(buf, offset) {
  if (!offset) {
    offset = 0;
  }
  const transport = new UFramedTransport(buf);
  transport.readPos = offset;
  const protocol = new TCompactProtocol(transport);
  const pageHeader = PageHeader.read(protocol);
  return {
    length: transport.readPos - offset,
    pageHeader
  };
}
export function getBitWidth(val) {
  if (val === 0) {
    return 0;
  }
  return Math.ceil(Math.log2(val + 1));
}
export function fieldIndexOf(arr, elem) {
  for (let j = 0; j < arr.length; j++) {
    if (arr[j].length > elem.length) {
      continue;
    }
    let m = true;
    for (let i = 0; i < elem.length; i++) {
      if (arr[j][i] === elem[i] || arr[j][i] === '+' || arr[j][i] === '#') {
        continue;
      }
      if (i >= arr[j].length && arr[j][arr[j].length - 1] === '#') {
        continue;
      }
      m = false;
      break;
    }
    if (m) return j;
  }
  return -1;
}
//# sourceMappingURL=read-utils.js.map