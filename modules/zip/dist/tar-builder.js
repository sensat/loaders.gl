"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tar_1 = __importDefault(require("./lib/tar/tar"));
const TAR_BUILDER_OPTIONS = {
    recordsPerBlock: 20
};
/**
 * Build a tar file by adding files
 */
class TARBuilder {
    static get properties() {
        return {
            id: 'tar',
            name: 'TAR',
            extensions: ['tar'],
            mimeTypes: ['application/x-tar'],
            builder: TARBuilder,
            options: TAR_BUILDER_OPTIONS
        };
    }
    constructor(options) {
        this.count = 0;
        this.options = { ...TAR_BUILDER_OPTIONS, ...options };
        this.tape = new tar_1.default(this.options.recordsPerBlock);
    }
    /** Adds a file to the archive. */
    addFile(filename, buffer) {
        this.tape.append(filename, new Uint8Array(buffer));
        this.count++;
    }
    async build() {
        return new Response(this.tape.save()).arrayBuffer();
    }
}
exports.default = TARBuilder;
