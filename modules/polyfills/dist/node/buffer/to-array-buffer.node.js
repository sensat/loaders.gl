"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferToArrayBuffer = void 0;
function bufferToArrayBuffer(buffer) {
    // TODO - per docs we should just be able to call buffer.buffer, but there are issues
    if (Buffer.isBuffer(buffer)) {
        const typedArray = new Uint8Array(buffer);
        return typedArray.buffer;
    }
    return buffer;
}
exports.bufferToArrayBuffer = bufferToArrayBuffer;
