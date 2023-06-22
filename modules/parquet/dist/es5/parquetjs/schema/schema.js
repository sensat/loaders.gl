"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetSchema = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _codecs = require("../codecs");
var _compression = require("../compression");
var _shred = require("./shred");
var _types = require("./types");
var ParquetSchema = function () {
  function ParquetSchema(schema) {
    (0, _classCallCheck2.default)(this, ParquetSchema);
    (0, _defineProperty2.default)(this, "schema", void 0);
    (0, _defineProperty2.default)(this, "fields", void 0);
    (0, _defineProperty2.default)(this, "fieldList", void 0);
    this.schema = schema;
    this.fields = buildFields(schema, 0, 0, []);
    this.fieldList = listFields(this.fields);
  }
  (0, _createClass2.default)(ParquetSchema, [{
    key: "findField",
    value: function findField(path) {
      if (typeof path === 'string') {
        path = path.split(',');
      } else {
        path = path.slice(0);
      }
      var n = this.fields;
      for (; path.length > 1; path.shift()) {
        n = n[path[0]].fields;
      }
      return n[path[0]];
    }
  }, {
    key: "findFieldBranch",
    value: function findFieldBranch(path) {
      if (typeof path === 'string') {
        path = path.split(',');
      }
      var branch = [];
      var n = this.fields;
      for (; path.length > 0; path.shift()) {
        branch.push(n[path[0]]);
        if (path.length > 1) {
          n = n[path[0]].fields;
        }
      }
      return branch;
    }
  }, {
    key: "shredRecord",
    value: function shredRecord(row, rowGroup) {
      (0, _shred.shredRecord)(this, row, rowGroup);
    }
  }, {
    key: "materializeRows",
    value: function materializeRows(rowGroup) {
      return (0, _shred.materializeRows)(this, rowGroup);
    }
  }, {
    key: "compress",
    value: function compress(type) {
      setCompress(this.schema, type);
      setCompress(this.fields, type);
      return this;
    }
  }, {
    key: "rowGroup",
    value: function rowGroup() {
      return (0, _shred.shredBuffer)(this);
    }
  }]);
  return ParquetSchema;
}();
exports.ParquetSchema = ParquetSchema;
function setCompress(schema, type) {
  for (var name in schema) {
    var node = schema[name];
    if (node.fields) {
      setCompress(node.fields, type);
    } else {
      node.compression = type;
    }
  }
}
function buildFields(schema, rLevelParentMax, dLevelParentMax, path) {
  var fieldList = {};
  for (var name in schema) {
    var opts = schema[name];
    var required = !opts.optional;
    var repeated = Boolean(opts.repeated);
    var rLevelMax = rLevelParentMax;
    var dLevelMax = dLevelParentMax;
    var repetitionType = 'REQUIRED';
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
      var _cpath = path.concat([name]);
      fieldList[name] = {
        name: name,
        path: _cpath,
        key: _cpath.join(),
        repetitionType: repetitionType,
        rLevelMax: rLevelMax,
        dLevelMax: dLevelMax,
        isNested: true,
        fieldCount: Object.keys(opts.fields).length,
        fields: buildFields(opts.fields, rLevelMax, dLevelMax, _cpath)
      };
      continue;
    }
    var typeDef = _types.PARQUET_LOGICAL_TYPES[opts.type];
    if (!typeDef) {
      throw new Error("invalid parquet type: ".concat(opts.type));
    }
    opts.encoding = opts.encoding || 'PLAIN';
    if (!(opts.encoding in _codecs.PARQUET_CODECS)) {
      throw new Error("unsupported parquet encoding: ".concat(opts.encoding));
    }
    opts.compression = opts.compression || 'UNCOMPRESSED';
    if (!(opts.compression in _compression.PARQUET_COMPRESSION_METHODS)) {
      throw new Error("unsupported compression method: ".concat(opts.compression));
    }
    var cpath = path.concat([name]);
    fieldList[name] = {
      name: name,
      primitiveType: typeDef.primitiveType,
      originalType: typeDef.originalType,
      path: cpath,
      key: cpath.join(),
      repetitionType: repetitionType,
      encoding: opts.encoding,
      compression: opts.compression,
      typeLength: opts.typeLength || typeDef.typeLength,
      presision: opts.presision,
      scale: opts.scale,
      rLevelMax: rLevelMax,
      dLevelMax: dLevelMax
    };
  }
  return fieldList;
}
function listFields(fields) {
  var list = [];
  for (var k in fields) {
    list.push(fields[k]);
    if (fields[k].isNested) {
      list = list.concat(listFields(fields[k].fields));
    }
  }
  return list;
}
//# sourceMappingURL=schema.js.map