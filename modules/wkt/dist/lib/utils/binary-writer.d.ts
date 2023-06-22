export default class BinaryWriter {
    arrayBuffer: ArrayBuffer;
    dataView: DataView;
    byteOffset: number;
    allowResize: boolean;
    constructor(size: number, allowResize?: boolean);
    writeUInt8(value: number): void;
    writeUInt16LE(value: number): void;
    writeUInt16BE(value: number): void;
    writeUInt32LE(value: number): void;
    writeUInt32BE(value: number): void;
    writeInt8(value: number): void;
    writeInt16LE(value: number): void;
    writeInt16BE(value: number): void;
    writeInt32LE(value: number): void;
    writeInt32BE(value: number): void;
    writeFloatLE(value: number): void;
    writeFloatBE(value: number): void;
    writeDoubleLE(value: number): void;
    writeDoubleBE(value: number): void;
    /** A varint uses a variable number of bytes */
    writeVarInt(value: number): number;
    /** Append another ArrayBuffer to this ArrayBuffer */
    writeBuffer(arrayBuffer: ArrayBuffer): void;
    /** Resizes this.arrayBuffer if not enough space */
    _ensureSize(size: number): void;
}
//# sourceMappingURL=binary-writer.d.ts.map