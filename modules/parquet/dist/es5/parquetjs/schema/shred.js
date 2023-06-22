"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ParquetRowGroup", {
  enumerable: true,
  get: function get() {
    return _declare.ParquetRowGroup;
  }
});
exports.materializeColumns = materializeColumns;
exports.materializeRows = materializeRows;
exports.shredBuffer = shredBuffer;
exports.shredRecord = shredRecord;
var _declare = require("./declare");
var Types = _interopRequireWildcard(require("./types"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function shredBuffer(schema) {
  var columnData = {};
  var _iterator = _createForOfIteratorHelper(schema.fieldList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var field = _step.value;
      columnData[field.key] = {
        dlevels: [],
        rlevels: [],
        values: [],
        pageHeaders: [],
        count: 0
      };
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return {
    rowCount: 0,
    columnData: columnData
  };
}
function shredRecord(schema, record, rowGroup) {
  var data = shredBuffer(schema).columnData;
  shredRecordFields(schema.fields, record, data, 0, 0);
  if (rowGroup.rowCount === 0) {
    rowGroup.rowCount = 1;
    rowGroup.columnData = data;
    return;
  }
  rowGroup.rowCount += 1;
  var _iterator2 = _createForOfIteratorHelper(schema.fieldList),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var field = _step2.value;
      Array.prototype.push.apply(rowGroup.columnData[field.key].rlevels, data[field.key].rlevels);
      Array.prototype.push.apply(rowGroup.columnData[field.key].dlevels, data[field.key].dlevels);
      Array.prototype.push.apply(rowGroup.columnData[field.key].values, data[field.key].values);
      rowGroup.columnData[field.key].count += data[field.key].count;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
function shredRecordFields(fields, record, data, rLevel, dLevel) {
  for (var name in fields) {
    var field = fields[name];
    var values = [];
    if (record && field.name in record && record[field.name] !== undefined && record[field.name] !== null) {
      if (record[field.name].constructor === Array) {
        values = record[field.name];
      } else {
        values.push(record[field.name]);
      }
    }
    if (values.length === 0 && Boolean(record) && field.repetitionType === 'REQUIRED') {
      throw new Error("missing required field: ".concat(field.name));
    }
    if (values.length > 1 && field.repetitionType !== 'REPEATED') {
      throw new Error("too many values for field: ".concat(field.name));
    }
    if (values.length === 0) {
      if (field.isNested) {
        shredRecordFields(field.fields, null, data, rLevel, dLevel);
      } else {
        data[field.key].count += 1;
        data[field.key].rlevels.push(rLevel);
        data[field.key].dlevels.push(dLevel);
      }
      continue;
    }
    for (var i = 0; i < values.length; i++) {
      var rlvl = i === 0 ? rLevel : field.rLevelMax;
      if (field.isNested) {
        shredRecordFields(field.fields, values[i], data, rlvl, field.dLevelMax);
      } else {
        data[field.key].count += 1;
        data[field.key].rlevels.push(rlvl);
        data[field.key].dlevels.push(field.dLevelMax);
        data[field.key].values.push(Types.toPrimitive(field.originalType || field.primitiveType, values[i]));
      }
    }
  }
}
function materializeRows(schema, rowGroup) {
  var rows = [];
  for (var i = 0; i < rowGroup.rowCount; i++) {
    rows.push({});
  }
  for (var key in rowGroup.columnData) {
    var columnData = rowGroup.columnData[key];
    if (columnData.count) {
      materializeColumnAsRows(schema, columnData, key, rows);
    }
  }
  return rows;
}
function materializeColumnAsRows(schema, columnData, key, rows) {
  var field = schema.findField(key);
  var branch = schema.findFieldBranch(key);
  var rLevels = new Array(field.rLevelMax + 1).fill(0);
  var vIndex = 0;
  for (var i = 0; i < columnData.count; i++) {
    var dLevel = columnData.dlevels[i];
    var rLevel = columnData.rlevels[i];
    rLevels[rLevel]++;
    rLevels.fill(0, rLevel + 1);
    var rIndex = 0;
    var record = rows[rLevels[rIndex++] - 1];
    var _iterator3 = _createForOfIteratorHelper(branch),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var step = _step3.value;
        if (step === field || dLevel < step.dLevelMax) {
          break;
        }
        switch (step.repetitionType) {
          case 'REPEATED':
            if (!(step.name in record)) {
              record[step.name] = [];
            }
            var _ix = rLevels[rIndex++];
            while (record[step.name].length <= _ix) {
              record[step.name].push({});
            }
            record = record[step.name][_ix];
            break;
          default:
            record[step.name] = record[step.name] || {};
            record = record[step.name];
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (dLevel === field.dLevelMax) {
      var value = Types.fromPrimitive(field.originalType || field.primitiveType, columnData.values[vIndex], field);
      vIndex++;
      switch (field.repetitionType) {
        case 'REPEATED':
          if (!(field.name in record)) {
            record[field.name] = [];
          }
          var ix = rLevels[rIndex];
          while (record[field.name].length <= ix) {
            record[field.name].push(null);
          }
          record[field.name][ix] = value;
          break;
        default:
          record[field.name] = value;
      }
    }
  }
}
function materializeColumns(schema, rowGroup) {
  var columns = {};
  for (var key in rowGroup.columnData) {
    var columnData = rowGroup.columnData[key];
    if (columnData.count) {
      materializeColumnAsColumnarArray(schema, columnData, rowGroup.rowCount, key, columns);
    }
  }
  return columns;
}
function materializeColumnAsColumnarArray(schema, columnData, rowCount, key, columns) {
  if (columnData.count <= 0) {
    return;
  }
  var field = schema.findField(key);
  var branch = schema.findFieldBranch(key);
  var columnName = branch[0].name;
  var column;
  var values = columnData.values;
  if (values.length === rowCount && branch[0].primitiveType) {
    column = values;
  }
  if (column) {
    columns[columnName] = column;
    return;
  }
  column = new Array(rowCount);
  for (var i = 0; i < rowCount; i++) {
    column[i] = {};
  }
  columns[columnName] = column;
  var rLevels = new Array(field.rLevelMax + 1).fill(0);
  var vIndex = 0;
  for (var _i = 0; _i < columnData.count; _i++) {
    var dLevel = columnData.dlevels[_i];
    var rLevel = columnData.rlevels[_i];
    rLevels[rLevel]++;
    rLevels.fill(0, rLevel + 1);
    var rIndex = 0;
    var record = column[rLevels[rIndex++] - 1];
    var _iterator4 = _createForOfIteratorHelper(branch),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var step = _step4.value;
        if (step === field || dLevel < step.dLevelMax) {
          break;
        }
        switch (step.repetitionType) {
          case 'REPEATED':
            if (!(step.name in record)) {
              record[step.name] = [];
            }
            var _ix2 = rLevels[rIndex++];
            while (record[step.name].length <= _ix2) {
              record[step.name].push({});
            }
            record = record[step.name][_ix2];
            break;
          default:
            record[step.name] = record[step.name] || {};
            record = record[step.name];
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    if (dLevel === field.dLevelMax) {
      var value = Types.fromPrimitive(field.originalType || field.primitiveType, columnData.values[vIndex], field);
      vIndex++;
      switch (field.repetitionType) {
        case 'REPEATED':
          if (!(field.name in record)) {
            record[field.name] = [];
          }
          var ix = rLevels[rIndex];
          while (record[field.name].length <= ix) {
            record[field.name].push(null);
          }
          record[field.name][ix] = value;
          break;
        default:
          record[field.name] = value;
      }
    }
  }
  for (var _i2 = 0; _i2 < rowCount; ++_i2) {
    if (columnName in column[_i2]) {
      column[_i2] = column[_i2][columnName];
    }
  }
}
//# sourceMappingURL=shred.js.map