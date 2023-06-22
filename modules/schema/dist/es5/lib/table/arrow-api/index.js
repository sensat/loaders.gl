"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Field: true,
  Schema: true,
  Table: true
};
Object.defineProperty(exports, "Field", {
  enumerable: true,
  get: function get() {
    return _arrowLikeField.ArrowLikeField;
  }
});
Object.defineProperty(exports, "Schema", {
  enumerable: true,
  get: function get() {
    return _arrowLikeSchema.ArrowLikeSchema;
  }
});
Object.defineProperty(exports, "Table", {
  enumerable: true,
  get: function get() {
    return _arrowLikeTable.ArrowLikeTable;
  }
});
var _arrowLikeField = require("./arrow-like-field");
var _arrowLikeSchema = require("./arrow-like-schema");
var _arrowLikeTable = require("./arrow-like-table");
var _arrowLikeType = require("./arrow-like-type");
Object.keys(_arrowLikeType).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _arrowLikeType[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _arrowLikeType[key];
    }
  });
});
//# sourceMappingURL=index.js.map