"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPCDSchema = void 0;
/**
 * Gets schema from PCD header
 * @param PCDheader
 * @param metadata
 * @returns Schema
 */
function getPCDSchema(PCDheader, metadata) {
    const offset = PCDheader.offset;
    const fields = [];
    if (offset.x !== undefined) {
        fields.push({
            name: 'POSITION',
            type: { type: 'fixed-size-list', listSize: 3, children: [{ name: 'xyz', type: 'float32' }] }
        });
    }
    if (offset.normal_x !== undefined) {
        fields.push({
            name: 'NORMAL',
            type: { type: 'fixed-size-list', listSize: 3, children: [{ name: 'xyz', type: 'float32' }] }
        });
    }
    if (offset.rgb !== undefined) {
        fields.push({
            name: 'COLOR_0',
            type: { type: 'fixed-size-list', listSize: 3, children: [{ name: 'rgb', type: 'uint8' }] }
        });
    }
    return { fields, metadata };
}
exports.getPCDSchema = getPCDSchema;
