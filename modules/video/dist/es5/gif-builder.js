"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assert = require("./lib/utils/assert");
var _gifshot = _interopRequireDefault(require("./lib/gifshot/gifshot"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var GIF_BUILDER_OPTIONS = {
  source: 'images',
  width: 200,
  height: 200,
  crossOrigin: 'Anonymous',
  progressCallback: function progressCallback(captureProgress) {},
  completeCallback: function completeCallback() {},
  numWorkers: 2,
  sampleInterval: 10,
  interval: 0.1,
  offset: null,
  numFrames: 10,
  frameDuration: 1,
  filter: '',
  waterMark: null,
  waterMarkHeight: null,
  waterMarkWidth: null,
  waterMarkXCoordinate: 1,
  waterMarkYCoordinate: 1,
  text: '',
  showFrameText: true,
  fontWeight: 'normal',
  fontSize: '16px',
  minFontSize: '10px',
  resizeFont: false,
  fontFamily: 'sans-serif',
  fontColor: '#ffffff',
  textAlign: 'center',
  textBaseline: 'bottom',
  textXCoordinate: null,
  textYCoordinate: null,
  webcamVideoElement: null,
  keepCameraOn: false,
  cameraStream: null,
  saveRenderingContexts: false,
  savedRenderingContexts: []
};
var GIFBuilder = function () {
  function GIFBuilder(options) {
    (0, _classCallCheck2.default)(this, GIFBuilder);
    this.options = _objectSpread({}, options);
    this.source = options.source;
    delete options.source;
    this.files = [];
    this.gifshot = _gifshot.default;
  }
  (0, _createClass2.default)(GIFBuilder, [{
    key: "initialize",
    value: function () {
      var _initialize = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(options) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function initialize(_x) {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
  }, {
    key: "add",
    value: function () {
      var _add = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(file) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.initialize();
            case 2:
              this.files.push(file);
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function add(_x2) {
        return _add.apply(this, arguments);
      }
      return add;
    }()
  }, {
    key: "build",
    value: function () {
      var _build = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.initialize();
            case 2:
              this._cleanOptions(this.options);
              _context3.t0 = this.source;
              _context3.next = _context3.t0 === 'images' ? 6 : _context3.t0 === 'video' ? 8 : _context3.t0 === 'webcam' ? 10 : 12;
              break;
            case 6:
              this.options.images = this.files;
              return _context3.abrupt("break", 13);
            case 8:
              this.options.video = this.files;
              return _context3.abrupt("break", 13);
            case 10:
              (0, _assert.assert)(this.files.length === 0);
              return _context3.abrupt("break", 13);
            case 12:
              throw new Error('GIFBuilder: invalid source');
            case 13:
              _context3.next = 15;
              return this._createGIF();
            case 15:
              return _context3.abrupt("return", _context3.sent);
            case 16:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function build() {
        return _build.apply(this, arguments);
      }
      return build;
    }()
  }, {
    key: "_createGIF",
    value: function () {
      var _createGIF2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
        var _this = this;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", new Promise(function (resolve, reject) {
                _this.gifshot.createGIF(_this.options, function (result) {
                  if (result.error) {
                    reject(result.errorMsg);
                    return;
                  }
                  resolve(result.image);
                });
              }));
            case 1:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function _createGIF() {
        return _createGIF2.apply(this, arguments);
      }
      return _createGIF;
    }()
  }, {
    key: "_cleanOptions",
    value: function _cleanOptions(options) {
      if (options.video || options.images || options.gifWidth || options.gifHeight) {
        console.warn('GIFBuilder: ignoring options');
      }
      delete options.video;
      delete options.images;
      options.gifWidth = options.width;
      options.gifHeight = options.height;
      delete options.width;
      delete options.height;
    }
  }], [{
    key: "properties",
    get: function get() {
      return {
        id: 'gif',
        name: 'GIF',
        extensions: ['gif'],
        mimeTypes: ['image/gif'],
        builder: GIFBuilder,
        options: GIF_BUILDER_OPTIONS
      };
    }
  }]);
  return GIFBuilder;
}();
exports.default = GIFBuilder;
//# sourceMappingURL=gif-builder.js.map