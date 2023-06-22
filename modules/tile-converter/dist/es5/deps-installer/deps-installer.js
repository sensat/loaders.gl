"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DepsInstaller = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _core = require("@loaders.gl/core");
var _zip = require("@loaders.gl/zip");
var _fileUtils = require("../lib/utils/file-utils");
var _path = require("path");
var _workerUtils = require("@loaders.gl/worker-utils");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
var PGM_LINK = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/egm/egm2008-5.zip';
var DepsInstaller = function () {
  function DepsInstaller() {
    (0, _classCallCheck2.default)(this, DepsInstaller);
  }
  (0, _createClass2.default)(DepsInstaller, [{
    key: "install",
    value: function () {
      var _install = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        var path,
          workersPath,
          fileMap,
          depsPath,
          childProcess,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              path = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
              workersPath = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
              console.log('Installing "EGM2008-5" model...');
              _context.next = 5;
              return (0, _core.load)(PGM_LINK, _zip.ZipLoader, {});
            case 5:
              fileMap = _context.sent;
              depsPath = process.cwd();
              if (path) {
                depsPath = (0, _path.join)(depsPath, path);
              }
              _context.next = 10;
              return (0, _fileUtils.writeFile)(depsPath, new Uint8Array(fileMap['geoids/egm2008-5.pgm']), 'egm2008-5.pgm');
            case 10:
              console.log('Installing "I3S Content Loader worker"');
              _context.next = 13;
              return this.installWorker('i3s', 'i3s-content-worker-node.js', workersPath);
            case 13:
              console.log('Installing "Draco Loader worker"');
              _context.next = 16;
              return this.installWorker('draco', 'draco-worker-node.js', workersPath);
            case 16:
              console.log('Installing "Basis Loader worker"');
              _context.next = 19;
              return this.installWorker('textures', 'basis-worker-node.js', workersPath);
            case 19:
              console.log('Installing "join-images" npm package');
              childProcess = new _workerUtils.ChildProcessProxy();
              _context.next = 23;
              return childProcess.start({
                command: 'npm',
                arguments: ['install', 'sharp@0.30.4', 'join-images@1.1.3'],
                wait: 0
              });
            case 23:
              console.log('All dependencies were installed succesfully.');
            case 24:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function install() {
        return _install.apply(this, arguments);
      }
      return install;
    }()
  }, {
    key: "installWorker",
    value: function () {
      var _installWorker = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(module, name, extraPath) {
        var fileResponse, fileData, path;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _core.fetchFile)("https://unpkg.com/@loaders.gl/".concat(module, "@").concat(VERSION, "/dist/").concat(name));
            case 2:
              fileResponse = _context2.sent;
              _context2.next = 5;
              return fileResponse.arrayBuffer();
            case 5:
              fileData = _context2.sent;
              if (fileData) {
                _context2.next = 8;
                break;
              }
              return _context2.abrupt("return");
            case 8:
              path = (0, _path.join)(process.cwd(), extraPath, 'modules', module, 'dist');
              _context2.next = 11;
              return (0, _fileUtils.writeFile)(path, fileData, name);
            case 11:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function installWorker(_x, _x2, _x3) {
        return _installWorker.apply(this, arguments);
      }
      return installWorker;
    }()
  }]);
  return DepsInstaller;
}();
exports.DepsInstaller = DepsInstaller;
//# sourceMappingURL=deps-installer.js.map