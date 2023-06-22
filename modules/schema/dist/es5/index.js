"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ArrowLikeDataType", {
  enumerable: true,
  get: function get() {
    return _arrowApi.DataType;
  }
});
Object.defineProperty(exports, "ArrowLikeField", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Field;
  }
});
Object.defineProperty(exports, "ArrowLikeSchema", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Schema;
  }
});
Object.defineProperty(exports, "ArrowLikeTable", {
  enumerable: true,
  get: function get() {
    return _arrowLikeTable.ArrowLikeTable;
  }
});
Object.defineProperty(exports, "AsyncQueue", {
  enumerable: true,
  get: function get() {
    return _asyncQueue.default;
  }
});
Object.defineProperty(exports, "Binary", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Binary;
  }
});
Object.defineProperty(exports, "Bool", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Bool;
  }
});
Object.defineProperty(exports, "ColumnarTableBatchAggregator", {
  enumerable: true,
  get: function get() {
    return _columnarTableBatchAggregator.ColumnarTableBatchAggregator;
  }
});
Object.defineProperty(exports, "Date", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Date;
  }
});
Object.defineProperty(exports, "DateDay", {
  enumerable: true,
  get: function get() {
    return _arrowApi.DateDay;
  }
});
Object.defineProperty(exports, "DateMillisecond", {
  enumerable: true,
  get: function get() {
    return _arrowApi.DateMillisecond;
  }
});
Object.defineProperty(exports, "FixedSizeList", {
  enumerable: true,
  get: function get() {
    return _arrowApi.FixedSizeList;
  }
});
Object.defineProperty(exports, "Float", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Float;
  }
});
Object.defineProperty(exports, "Float16", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Float16;
  }
});
Object.defineProperty(exports, "Float32", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Float32;
  }
});
Object.defineProperty(exports, "Float64", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Float64;
  }
});
Object.defineProperty(exports, "Int", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Int;
  }
});
Object.defineProperty(exports, "Int16", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Int16;
  }
});
Object.defineProperty(exports, "Int32", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Int32;
  }
});
Object.defineProperty(exports, "Int64", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Int64;
  }
});
Object.defineProperty(exports, "Int8", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Int8;
  }
});
Object.defineProperty(exports, "Interval", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Interval;
  }
});
Object.defineProperty(exports, "IntervalDayTime", {
  enumerable: true,
  get: function get() {
    return _arrowApi.IntervalDayTime;
  }
});
Object.defineProperty(exports, "IntervalYearMonth", {
  enumerable: true,
  get: function get() {
    return _arrowApi.IntervalYearMonth;
  }
});
Object.defineProperty(exports, "Null", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Null;
  }
});
Object.defineProperty(exports, "RowTableBatchAggregator", {
  enumerable: true,
  get: function get() {
    return _rowTableBatchAggregator.RowTableBatchAggregator;
  }
});
Object.defineProperty(exports, "Struct", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Struct;
  }
});
Object.defineProperty(exports, "TableBatchBuilder", {
  enumerable: true,
  get: function get() {
    return _tableBatchBuilder.TableBatchBuilder;
  }
});
Object.defineProperty(exports, "Time", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Time;
  }
});
Object.defineProperty(exports, "TimeMillisecond", {
  enumerable: true,
  get: function get() {
    return _arrowApi.TimeMillisecond;
  }
});
Object.defineProperty(exports, "TimeSecond", {
  enumerable: true,
  get: function get() {
    return _arrowApi.TimeSecond;
  }
});
Object.defineProperty(exports, "Timestamp", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Timestamp;
  }
});
Object.defineProperty(exports, "TimestampMicrosecond", {
  enumerable: true,
  get: function get() {
    return _arrowApi.TimestampMicrosecond;
  }
});
Object.defineProperty(exports, "TimestampMillisecond", {
  enumerable: true,
  get: function get() {
    return _arrowApi.TimestampMillisecond;
  }
});
Object.defineProperty(exports, "TimestampNanosecond", {
  enumerable: true,
  get: function get() {
    return _arrowApi.TimestampNanosecond;
  }
});
Object.defineProperty(exports, "TimestampSecond", {
  enumerable: true,
  get: function get() {
    return _arrowApi.TimestampSecond;
  }
});
Object.defineProperty(exports, "Uint16", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Uint16;
  }
});
Object.defineProperty(exports, "Uint32", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Uint32;
  }
});
Object.defineProperty(exports, "Uint64", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Uint64;
  }
});
Object.defineProperty(exports, "Uint8", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Uint8;
  }
});
Object.defineProperty(exports, "Utf8", {
  enumerable: true,
  get: function get() {
    return _arrowApi.Utf8;
  }
});
Object.defineProperty(exports, "convertToArrayRow", {
  enumerable: true,
  get: function get() {
    return _rowUtils.convertToArrayRow;
  }
});
Object.defineProperty(exports, "convertToObjectRow", {
  enumerable: true,
  get: function get() {
    return _rowUtils.convertToObjectRow;
  }
});
Object.defineProperty(exports, "deduceMeshField", {
  enumerable: true,
  get: function get() {
    return _deduceMeshSchema.deduceMeshField;
  }
});
Object.defineProperty(exports, "deduceMeshSchema", {
  enumerable: true,
  get: function get() {
    return _deduceMeshSchema.deduceMeshSchema;
  }
});
Object.defineProperty(exports, "deduceTableSchema", {
  enumerable: true,
  get: function get() {
    return _tableSchema.deduceTableSchema;
  }
});
Object.defineProperty(exports, "getArrowType", {
  enumerable: true,
  get: function get() {
    return _arrowTypeUtils.getArrowType;
  }
});
Object.defineProperty(exports, "getDataTypeFromArray", {
  enumerable: true,
  get: function get() {
    return _dataType.getDataTypeFromArray;
  }
});
Object.defineProperty(exports, "getMeshBoundingBox", {
  enumerable: true,
  get: function get() {
    return _meshUtils.getMeshBoundingBox;
  }
});
Object.defineProperty(exports, "getMeshSize", {
  enumerable: true,
  get: function get() {
    return _meshUtils.getMeshSize;
  }
});
Object.defineProperty(exports, "getTableCell", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableCell;
  }
});
Object.defineProperty(exports, "getTableColumnIndex", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableColumnIndex;
  }
});
Object.defineProperty(exports, "getTableColumnName", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableColumnName;
  }
});
Object.defineProperty(exports, "getTableLength", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableLength;
  }
});
Object.defineProperty(exports, "getTableNumCols", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableNumCols;
  }
});
Object.defineProperty(exports, "getTableRowAsArray", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableRowAsArray;
  }
});
Object.defineProperty(exports, "getTableRowAsObject", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableRowAsObject;
  }
});
Object.defineProperty(exports, "getTableRowShape", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.getTableRowShape;
  }
});
Object.defineProperty(exports, "getTypeInfo", {
  enumerable: true,
  get: function get() {
    return _getTypeInfo.getTypeInfo;
  }
});
Object.defineProperty(exports, "makeArrayRowIterator", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.makeArrayRowIterator;
  }
});
Object.defineProperty(exports, "makeMeshAttributeMetadata", {
  enumerable: true,
  get: function get() {
    return _deduceMeshSchema.makeMeshAttributeMetadata;
  }
});
Object.defineProperty(exports, "makeObjectRowIterator", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.makeObjectRowIterator;
  }
});
Object.defineProperty(exports, "makeRowIterator", {
  enumerable: true,
  get: function get() {
    return _tableAccessors.makeRowIterator;
  }
});
Object.defineProperty(exports, "makeTableFromData", {
  enumerable: true,
  get: function get() {
    return _makeTable.makeTableFromData;
  }
});
var _tableBatchBuilder = require("./lib/table/batches/table-batch-builder");
var _rowTableBatchAggregator = require("./lib/table/batches/row-table-batch-aggregator");
var _columnarTableBatchAggregator = require("./lib/table/batches/columnar-table-batch-aggregator");
var _tableAccessors = require("./lib/table/simple-table/table-accessors");
var _arrowLikeTable = require("./lib/table/arrow-api/arrow-like-table");
var _makeTable = require("./lib/table/simple-table/make-table");
var _tableSchema = require("./lib/table/simple-table/table-schema");
var _rowUtils = require("./lib/table/simple-table/row-utils");
var _dataType = require("./lib/table/simple-table/data-type");
var _meshUtils = require("./lib/mesh/mesh-utils");
var _deduceMeshSchema = require("./lib/mesh/deduce-mesh-schema");
var _arrowApi = require("./lib/table/arrow-api");
var _getTypeInfo = require("./lib/table/arrow-api/get-type-info");
var _arrowTypeUtils = require("./lib/table/arrow/arrow-type-utils");
var _asyncQueue = _interopRequireDefault(require("./lib/utils/async-queue"));
//# sourceMappingURL=index.js.map