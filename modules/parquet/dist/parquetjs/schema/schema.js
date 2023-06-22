"use strict";
// Forked from https://github.com/kbajalc/parquets under MIT license (Copyright (c) 2017 ironSource Ltd.)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetSchema = void 0;
const codecs_1 = require("../codecs");
const compression_1 = require("../compression");
const shred_1 = require("./shred");
const types_1 = require("./types");
/**
 * A parquet file schema
 */
class ParquetSchema {
    /**
     * Create a new schema from a JSON schema definition
     */
    constructor(schema) {
        this.schema = schema;
        this.fields = buildFields(schema, 0, 0, []);
        this.fieldList = listFields(this.fields);
    }
    /**
     * Retrieve a field definition
     */
    findField(path) {
        if (typeof path === 'string') {
            // tslint:disable-next-line:no-parameter-reassignment
            path = path.split(',');
        }
        else {
            // tslint:disable-next-line:no-parameter-reassignment
            path = path.slice(0); // clone array
        }
        let n = this.fields;
        for (; path.length > 1; path.shift()) {
            n = n[path[0]].fields;
        }
        return n[path[0]];
    }
    /**
     * Retrieve a field definition and all the field's ancestors
     */
    findFieldBranch(path) {
        if (typeof path === 'string') {
            // tslint:disable-next-line:no-parameter-reassignment
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
        (0, shred_1.shredRecord)(this, row, rowGroup);
    }
    materializeRows(rowGroup) {
        return (0, shred_1.materializeRows)(this, rowGroup);
    }
    compress(type) {
        setCompress(this.schema, type);
        setCompress(this.fields, type);
        return this;
    }
    rowGroup() {
        return (0, shred_1.shredBuffer)(this);
    }
}
exports.ParquetSchema = ParquetSchema;
function setCompress(schema, type) {
    for (const name in schema) {
        const node = schema[name];
        if (node.fields) {
            setCompress(node.fields, type);
        }
        else {
            node.compression = type;
        }
    }
}
// eslint-disable-next-line max-statements, complexity
function buildFields(schema, rLevelParentMax, dLevelParentMax, path) {
    const fieldList = {};
    for (const name in schema) {
        const opts = schema[name];
        /* field repetition type */
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
            if (required)
                dLevelMax++;
        }
        /* nested field */
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
            continue; // eslint-disable-line no-continue
        }
        const typeDef = types_1.PARQUET_LOGICAL_TYPES[opts.type];
        if (!typeDef) {
            throw new Error(`invalid parquet type: ${opts.type}`);
        }
        opts.encoding = opts.encoding || 'PLAIN';
        if (!(opts.encoding in codecs_1.PARQUET_CODECS)) {
            throw new Error(`unsupported parquet encoding: ${opts.encoding}`);
        }
        opts.compression = opts.compression || 'UNCOMPRESSED';
        if (!(opts.compression in compression_1.PARQUET_COMPRESSION_METHODS)) {
            throw new Error(`unsupported compression method: ${opts.compression}`);
        }
        /* add to schema */
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
