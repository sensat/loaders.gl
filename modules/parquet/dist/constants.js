"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARQUET_RDLVL_ENCODING = exports.PARQUET_RDLVL_TYPE = exports.PARQUET_VERSION = exports.PARQUET_MAGIC_ENCRYPTED = exports.PARQUET_MAGIC = void 0;
// Forked from https://github.com/kbajalc/parquets under MIT license (Copyright (c) 2017 ironSource Ltd.)
/**
 * Parquet File Magic String
 */
exports.PARQUET_MAGIC = 'PAR1';
exports.PARQUET_MAGIC_ENCRYPTED = 'PARE';
/**
 * Parquet File Format Version
 */
exports.PARQUET_VERSION = 1;
/**
 * Internal type used for repetition/definition levels
 */
exports.PARQUET_RDLVL_TYPE = 'INT32';
exports.PARQUET_RDLVL_ENCODING = 'RLE';
