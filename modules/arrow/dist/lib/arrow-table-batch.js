"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apache_arrow_1 = require("apache-arrow");
const schema_1 = require("@loaders.gl/schema");
class ArrowTableBatchAggregator extends schema_1.ColumnarTableBatchAggregator {
    constructor(schema, options) {
        super(schema, options);
        this.arrowSchema = null;
    }
    getBatch() {
        const batch = super.getBatch();
        if (batch) {
            // Get the arrow schema
            this.arrowSchema = this.arrowSchema || getArrowSchema(batch.schema);
            // Get arrow format vectors
            const arrowVectors = getArrowVectors(this.arrowSchema, batch.data);
            // Create the record batch
            const recordBatch = new apache_arrow_1.RecordBatch(this.arrowSchema, (0, apache_arrow_1.makeData)({
                type: new apache_arrow_1.Struct(this.arrowSchema.fields),
                children: arrowVectors.map(({ data }) => data[0])
            }));
            return {
                shape: 'arrow-table',
                batchType: 'data',
                data: recordBatch,
                length: batch.length
            };
        }
        return null;
    }
}
exports.default = ArrowTableBatchAggregator;
// Convert from a simple loaders.gl schema to an Arrow schema
function getArrowSchema(schema) {
    const arrowFields = [];
    for (const key in schema) {
        const field = schema[key];
        if (field.type === Float32Array) {
            // TODO - just store the original field as metadata?
            const metadata = new Map(); // field;
            // arrow: new Field(name, nullable, metadata)
            const arrowField = new apache_arrow_1.Field(field.name, new apache_arrow_1.Float32(), field.nullable, metadata);
            arrowFields.push(arrowField);
        }
    }
    if (arrowFields.length === 0) {
        throw new Error('No arrow convertible fields');
    }
    return new apache_arrow_1.Schema(arrowFields);
}
// Convert from simple loaders.gl arrays to arrow vectors
function getArrowVectors(arrowSchema, data) {
    const arrowVectors = [];
    for (const field of arrowSchema.fields) {
        const vector = data[field.name];
        if (vector instanceof Float32Array) {
            const arrowVector = (0, apache_arrow_1.makeVector)(vector);
            arrowVectors.push(arrowVector);
        }
    }
    if (arrowSchema.fields.length !== arrowVectors.length) {
        throw new Error('Some columns not arrow convertible');
    }
    return arrowVectors;
}
