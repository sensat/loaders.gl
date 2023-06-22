import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Schema, Field, RecordBatch, Struct, makeVector, makeData, Float32 } from 'apache-arrow';
import { ColumnarTableBatchAggregator } from '@loaders.gl/schema';
export default class ArrowTableBatchAggregator extends ColumnarTableBatchAggregator {
  constructor(schema, options) {
    super(schema, options);
    _defineProperty(this, "arrowSchema", void 0);
    this.arrowSchema = null;
  }
  getBatch() {
    const batch = super.getBatch();
    if (batch) {
      this.arrowSchema = this.arrowSchema || getArrowSchema(batch.schema);
      const arrowVectors = getArrowVectors(this.arrowSchema, batch.data);
      const recordBatch = new RecordBatch(this.arrowSchema, makeData({
        type: new Struct(this.arrowSchema.fields),
        children: arrowVectors.map(_ref => {
          let {
            data
          } = _ref;
          return data[0];
        })
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
function getArrowSchema(schema) {
  const arrowFields = [];
  for (const key in schema) {
    const field = schema[key];
    if (field.type === Float32Array) {
      const metadata = new Map();
      const arrowField = new Field(field.name, new Float32(), field.nullable, metadata);
      arrowFields.push(arrowField);
    }
  }
  if (arrowFields.length === 0) {
    throw new Error('No arrow convertible fields');
  }
  return new Schema(arrowFields);
}
function getArrowVectors(arrowSchema, data) {
  const arrowVectors = [];
  for (const field of arrowSchema.fields) {
    const vector = data[field.name];
    if (vector instanceof Float32Array) {
      const arrowVector = makeVector(vector);
      arrowVectors.push(arrowVector);
    }
  }
  if (arrowSchema.fields.length !== arrowVectors.length) {
    throw new Error('Some columns not arrow convertible');
  }
  return arrowVectors;
}
//# sourceMappingURL=arrow-table-batch.js.map