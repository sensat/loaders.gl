"use strict";
// loaders.gl, MIT license
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.Schema = exports.Field = void 0;
var arrow_like_field_1 = require("./arrow-like-field");
Object.defineProperty(exports, "Field", { enumerable: true, get: function () { return arrow_like_field_1.ArrowLikeField; } });
var arrow_like_schema_1 = require("./arrow-like-schema");
Object.defineProperty(exports, "Schema", { enumerable: true, get: function () { return arrow_like_schema_1.ArrowLikeSchema; } });
var arrow_like_table_1 = require("./arrow-like-table");
Object.defineProperty(exports, "Table", { enumerable: true, get: function () { return arrow_like_table_1.ArrowLikeTable; } });
__exportStar(require("./arrow-like-type"), exports);
