import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { PARQUET_CODECS } from '../codecs';
import { PARQUET_COMPRESSION_METHODS } from '../compression';
import { materializeRows, shredBuffer, shredRecord } from './shred';
import { PARQUET_LOGICAL_TYPES } from './types';
export class ParquetSchema {
  constructor(schema) {
    _defineProperty(this, "schema", void 0);
    _defineProperty(this, "fields", void 0);
    _defineProperty(this, "fieldList", void 0);
    this.schema = schema;
    this.fields = buildFields(schema, 0, 0, []);
    this.fieldList = listFields(this.fields);
  }
  findField(path) {
    if (typeof path === 'string') {
      path = path.split(',');
    } else {
      path = path.slice(0);
    }
    let n = this.fields;
    for (; path.length > 1; path.shift()) {
      n = n[path[0]].fields;
    }
    return n[path[0]];
  }
  findFieldBranch(path) {
    if (typeof path === 'string') {
      path = path.split(',');
    }
    const branch = [];
    let n = this.fields;
    for (; path.length > 0; path.shift()) {
      branch.push(n[path[0]]);
      if (path.length > 1) {
        n = n[path[0]].fields;
      }
    }
    return branch;
  }
  shredRecord(row, rowGroup) {
    shredRecord(this, row, rowGroup);
  }
  materializeRows(rowGroup) {
    return materializeRows(this, rowGroup);
  }
  compress(type) {
    setCompress(this.schema, type);
    setCompress(this.fields, type);
    return this;
  }
  rowGroup() {
    return shredBuffer(this);
  }
}
function setCompress(schema, type) {
  for (const name in schema) {
    const node = schema[name];
    if (node.fields) {
      setCompress(node.fields, type);
    } else {
      node.compression = type;
    }
  }
}
function buildFields(schema, rLevelParentMax, dLevelParentMax, path) {
  const fieldList = {};
  for (const name in schema) {
    const opts = schema[name];
    const required = !opts.optional;
    const repeated = Boolean(opts.repeated);
    let rLevelMax = rLevelParentMax;
    let dLevelMax = dLevelParentMax;
    let repetitionType = 'REQUIRED';
    if (!required) {
      repetitionType = 'OPTIONAL';
      dLevelMax++;
    }
    if (repeated) {
      repetitionType = 'REPEATED';
      rLevelMax++;
      if (required) dLevelMax++;
    }
    if (opts.fields) {
      const cpath = path.concat([name]);
      fieldList[name] = {
        name,
        path: cpath,
        key: cpath.join(),
        repetitionType,
        rLevelMax,
        dLevelMax,
        isNested: true,
        fieldCount: Object.keys(opts.fields).length,
        fields: buildFields(opts.fields, rLevelMax, dLevelMax, cpath)
      };
      continue;
    }
    const typeDef = PARQUET_LOGICAL_TYPES[opts.type];
    if (!typeDef) {
      throw new Error("invalid parquet type: ".concat(opts.type));
    }
    opts.encoding = opts.encoding || 'PLAIN';
    if (!(opts.encoding in PARQUET_CODECS)) {
      throw new Error("unsupported parquet encoding: ".concat(opts.encoding));
    }
    opts.compression = opts.compression || 'UNCOMPRESSED';
    if (!(opts.compression in PARQUET_COMPRESSION_METHODS)) {
      throw new Error("unsupported compression method: ".concat(opts.compression));
    }
    const cpath = path.concat([name]);
    fieldList[name] = {
      name,
      primitiveType: typeDef.primitiveType,
      originalType: typeDef.originalType,
      path: cpath,
      key: cpath.join(),
      repetitionType,
      encoding: opts.encoding,
      compression: opts.compression,
      typeLength: opts.typeLength || typeDef.typeLength,
      presision: opts.presision,
      scale: opts.scale,
      rLevelMax,
      dLevelMax
    };
  }
  return fieldList;
}
function listFields(fields) {
  let list = [];
  for (const k in fields) {
    list.push(fields[k]);
    if (fields[k].isNested) {
      list = list.concat(listFields(fields[k].fields));
    }
  }
  return list;
}
//# sourceMappingURL=schema.js.map