"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckArrowLoader = exports.ArrowLoader = exports.ArrowWorkerLoader = exports.ArrowWriter = exports.VECTOR_TYPES = void 0;
const arrow_loader_1 = require("./arrow-loader");
Object.defineProperty(exports, "ArrowWorkerLoader", { enumerable: true, get: function () { return arrow_loader_1.ArrowLoader; } });
const parse_arrow_sync_1 = __importDefault(require("./lib/parse-arrow-sync"));
const parse_arrow_in_batches_1 = require("./lib/parse-arrow-in-batches");
const schema_1 = require("@loaders.gl/schema");
const arrow_table_batch_1 = __importDefault(require("./lib/arrow-table-batch"));
// Make the ArrowBatch type available
schema_1.TableBatchBuilder.ArrowBatch = arrow_table_batch_1.default;
// Types
var types_1 = require("./types");
Object.defineProperty(exports, "VECTOR_TYPES", { enumerable: true, get: function () { return types_1.VECTOR_TYPES; } });
// Arrow writer
var arrow_writer_1 = require("./arrow-writer");
Object.defineProperty(exports, "ArrowWriter", { enumerable: true, get: function () { return arrow_writer_1.ArrowWriter; } });
/** ArrowJS table loader */
exports.ArrowLoader = {
    ...arrow_loader_1.ArrowLoader,
    parse: async (arraybuffer, options) => (0, parse_arrow_sync_1.default)(arraybuffer, options),
    parseSync: parse_arrow_sync_1.default,
    parseInBatches: parse_arrow_in_batches_1.parseArrowInBatches
};
exports._typecheckArrowLoader = exports.ArrowLoader;
