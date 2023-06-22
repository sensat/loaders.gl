import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { ArrowLikeField } from './arrow-like-field';
export class ArrowLikeSchema {
  constructor(fields) {
    let metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Map();
    _defineProperty(this, "fields", void 0);
    _defineProperty(this, "metadata", void 0);
    this.fields = fields.map(field => new ArrowLikeField(field.name, field.type, field.nullable, field.metadata));
    this.metadata = metadata instanceof Map ? metadata : new Map(Object.entries(metadata));
  }
  compareTo(other) {
    if (this.metadata !== other.metadata) {
      return false;
    }
    if (this.fields.length !== other.fields.length) {
      return false;
    }
    for (let i = 0; i < this.fields.length; ++i) {
      if (!this.fields[i].compareTo(other.fields[i])) {
        return false;
      }
    }
    return true;
  }
  select() {
    const nameMap = Object.create(null);
    for (var _len = arguments.length, columnNames = new Array(_len), _key = 0; _key < _len; _key++) {
      columnNames[_key] = arguments[_key];
    }
    for (const name of columnNames) {
      nameMap[name] = true;
    }
    const selectedFields = this.fields.filter(field => nameMap[field.name]);
    return new ArrowLikeSchema(selectedFields, this.metadata);
  }
  selectAt() {
    for (var _len2 = arguments.length, columnIndices = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      columnIndices[_key2] = arguments[_key2];
    }
    const selectedFields = columnIndices.map(index => this.fields[index]).filter(Boolean);
    return new ArrowLikeSchema(selectedFields, this.metadata);
  }
  assign(schemaOrFields) {
    let fields;
    let metadata = this.metadata;
    if (schemaOrFields instanceof ArrowLikeSchema) {
      const otherArrowLikeSchema = schemaOrFields;
      fields = otherArrowLikeSchema.fields;
      metadata = mergeMaps(mergeMaps(new Map(), this.metadata), otherArrowLikeSchema.metadata);
    } else {
      fields = schemaOrFields;
    }
    const fieldMap = Object.create(null);
    for (const field of this.fields) {
      fieldMap[field.name] = field;
    }
    for (const field of fields) {
      fieldMap[field.name] = field;
    }
    const mergedFields = Object.values(fieldMap);
    return new ArrowLikeSchema(mergedFields, metadata);
  }
}
function mergeMaps(m1, m2) {
  return new Map([...(m1 || new Map()), ...(m2 || new Map())]);
}
//# sourceMappingURL=arrow-like-schema.js.map