"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowLikeField = void 0;
/**
 * ArrowJS `Field` API-compatible class for row-based tables
 * https://loaders.gl/arrowjs/docs/api-reference/field
 * A field holds name, nullable, and metadata information about a table "column"
 * A Schema is essentially a list of fields
 */
class ArrowLikeField {
    constructor(name, type, nullable = false, metadata = new Map()) {
        this.name = name;
        this.type = type;
        this.nullable = nullable;
        this.metadata = metadata;
    }
    get typeId() {
        return this.type && this.type.typeId;
    }
    clone() {
        return new ArrowLikeField(this.name, this.type, this.nullable, this.metadata);
    }
    compareTo(other) {
        return (this.name === other.name &&
            this.type === other.type &&
            this.nullable === other.nullable &&
            this.metadata === other.metadata);
    }
    toString() {
        return `${this.type}${this.nullable ? ', nullable' : ''}${this.metadata ? `, metadata: ${this.metadata}` : ''}`;
    }
}
exports.ArrowLikeField = ArrowLikeField;
