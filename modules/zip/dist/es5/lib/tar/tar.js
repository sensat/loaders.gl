"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _utils = require("./utils");
var _header = require("./header");
var blockSize;
var headerLength;
var inputLength;
var recordSize = 512;
var Tar = function () {
  function Tar(recordsPerBlock) {
    (0, _classCallCheck2.default)(this, Tar);
    (0, _defineProperty2.default)(this, "written", void 0);
    (0, _defineProperty2.default)(this, "out", void 0);
    (0, _defineProperty2.default)(this, "blocks", []);
    (0, _defineProperty2.default)(this, "length", void 0);
    this.written = 0;
    blockSize = (recordsPerBlock || 20) * recordSize;
    this.out = (0, _utils.clean)(blockSize);
    this.blocks = [];
    this.length = 0;
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
    this.append = this.append.bind(this);
  }
  (0, _createClass2.default)(Tar, [{
    key: "append",
    value: function append(filepath, input, opts) {
      var checksum;
      if (typeof input === 'string') {
        input = (0, _utils.stringToUint8)(input);
      } else if (input.constructor && input.constructor !== Uint8Array.prototype.constructor) {
        var errorInputMatch = /function\s*([$A-Za-z_][0-9A-Za-z_]*)\s*\(/.exec(input.constructor.toString());
        var errorInput = errorInputMatch && errorInputMatch[1];
        var errorMessage = "Invalid input type. You gave me: ".concat(errorInput);
        throw errorMessage;
      }
      opts = opts || {};
      var mode = opts.mode || parseInt('777', 8) & 0xfff;
      var mtime = opts.mtime || Math.floor(Number(new Date()) / 1000);
      var uid = opts.uid || 0;
      var gid = opts.gid || 0;
      var data = {
        fileName: filepath,
        fileMode: (0, _utils.pad)(mode, 7),
        uid: (0, _utils.pad)(uid, 7),
        gid: (0, _utils.pad)(gid, 7),
        fileSize: (0, _utils.pad)(input.length, 11),
        mtime: (0, _utils.pad)(mtime, 11),
        checksum: '        ',
        type: '0',
        ustar: 'ustar  ',
        owner: opts.owner || '',
        group: opts.group || ''
      };
      checksum = 0;
      Object.keys(data).forEach(function (key) {
        var i;
        var value = data[key];
        var length;
        for (i = 0, length = value.length; i < length; i += 1) {
          checksum += value.charCodeAt(i);
        }
      });
      data.checksum = "".concat((0, _utils.pad)(checksum, 6), "\0 ");
      var headerArr = (0, _header.format)(data);
      headerLength = Math.ceil(headerArr.length / recordSize) * recordSize;
      inputLength = Math.ceil(input.length / recordSize) * recordSize;
      this.blocks.push({
        header: headerArr,
        input: input,
        headerLength: headerLength,
        inputLength: inputLength
      });
    }
  }, {
    key: "save",
    value: function save() {
      var buffers = [];
      var chunks = new Array();
      var length = 0;
      var max = Math.pow(2, 20);
      var chunk = new Array();
      this.blocks.forEach(function () {
        var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        if (length + b.headerLength + b.inputLength > max) {
          chunks.push({
            blocks: chunk,
            length: length
          });
          chunk = [];
          length = 0;
        }
        chunk.push(b);
        length += b.headerLength + b.inputLength;
      });
      chunks.push({
        blocks: chunk,
        length: length
      });
      chunks.forEach(function () {
        var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var buffer = new Uint8Array(c.length);
        var written = 0;
        c.blocks.forEach(function () {
          var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          buffer.set(b.header, written);
          written += b.headerLength;
          buffer.set(b.input, written);
          written += b.inputLength;
        });
        buffers.push(buffer);
      });
      buffers.push(new Uint8Array(2 * recordSize));
      return new Blob(buffers, {
        type: 'octet/stream'
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this.written = 0;
      this.out = (0, _utils.clean)(blockSize);
    }
  }]);
  return Tar;
}();
var _default = Tar;
exports.default = _default;
//# sourceMappingURL=tar.js.map