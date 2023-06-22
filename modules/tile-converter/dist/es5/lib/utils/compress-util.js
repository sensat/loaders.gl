"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFileToZip = addFileToZip;
exports.compressFileWithGzip = compressFileWithGzip;
exports.compressFilesWithZip = compressFilesWithZip;
exports.compressWithChildProcess = compressWithChildProcess;
exports.generateHash128FromZip = generateHash128FromZip;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _zlib = require("zlib");
var _path = require("path");
var _fs = require("fs");
var _archiver = _interopRequireDefault(require("archiver"));
var _fileUtils = require("./file-utils");
var _workerUtils = require("@loaders.gl/worker-utils");
var _jszip = _interopRequireDefault(require("jszip"));
var _crypto = require("@loaders.gl/crypto");
var _crypt = _interopRequireDefault(require("crypt"));
function compressFileWithGzip(pathFile) {
  var compressedPathFile = "".concat(pathFile, ".gz");
  var gzip = (0, _zlib.createGzip)();
  var input = (0, _fs.createReadStream)(pathFile);
  var output = (0, _fs.createWriteStream)(compressedPathFile);
  return new Promise(function (resolve, reject) {
    input.on('end', function () {
      console.log("".concat(compressedPathFile, " compressed and saved."));
      resolve(compressedPathFile);
    });
    input.on('error', function (error) {
      console.log("".concat(compressedPathFile, ": compression error!"));
      reject(error);
    });
    input.pipe(gzip).pipe(output);
  });
}
function compressFilesWithZip(_x, _x2) {
  return _compressFilesWithZip.apply(this, arguments);
}
function _compressFilesWithZip() {
  _compressFilesWithZip = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(fileMap, outputFile) {
    var level,
      output,
      archive,
      _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          level = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 0;
          _context2.prev = 1;
          _context2.next = 4;
          return (0, _fileUtils.removeFile)(outputFile);
        case 4:
          _context2.next = 8;
          break;
        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2["catch"](1);
        case 8:
          output = (0, _fs.createWriteStream)(outputFile);
          archive = (0, _archiver.default)('zip', {
            zlib: {
              level: level
            }
          });
          return _context2.abrupt("return", new Promise(function () {
            var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(resolve, reject) {
              var subFileName, subFileData;
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    output.on('close', function () {
                      console.log("".concat(outputFile, " saved."));
                      console.log("".concat(archive.pointer(), " total bytes"));
                      resolve(null);
                    });
                    output.on('end', function () {
                      console.log('Data has been drained');
                      resolve(null);
                    });
                    archive.on('warning', function (err) {
                      console.log(err);
                      reject(err);
                    });
                    archive.on('error', function (err) {
                      reject(err);
                    });
                    archive.pipe(output);
                    _context.t0 = _regenerator.default.keys(fileMap);
                  case 6:
                    if ((_context.t1 = _context.t0()).done) {
                      _context.next = 13;
                      break;
                    }
                    subFileName = _context.t1.value;
                    subFileData = fileMap[subFileName];
                    _context.next = 11;
                    return appendFileToArchive(archive, subFileName, subFileData);
                  case 11:
                    _context.next = 6;
                    break;
                  case 13:
                    archive.finalize();
                  case 14:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x18, _x19) {
              return _ref.apply(this, arguments);
            };
          }()));
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 6]]);
  }));
  return _compressFilesWithZip.apply(this, arguments);
}
function compressWithChildProcess(_x3, _x4, _x5, _x6, _x7) {
  return _compressWithChildProcess.apply(this, arguments);
}
function _compressWithChildProcess() {
  _compressWithChildProcess = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(inputFolder, outputFile, level, inputFiles, sevenZipExe) {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(process.platform === 'win32')) {
            _context3.next = 5;
            break;
          }
          _context3.next = 3;
          return compressWithChildProcessWindows(inputFolder, outputFile, level, inputFiles, sevenZipExe);
        case 3:
          _context3.next = 7;
          break;
        case 5:
          _context3.next = 7;
          return compressWithChildProcessUnix(inputFolder, outputFile, level, inputFiles);
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _compressWithChildProcess.apply(this, arguments);
}
function compressWithChildProcessUnix(_x8, _x9) {
  return _compressWithChildProcessUnix.apply(this, arguments);
}
function _compressWithChildProcessUnix() {
  _compressWithChildProcessUnix = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(inputFolder, outputFile) {
    var level,
      inputFiles,
      fullOutputFile,
      args,
      childProcess,
      _args4 = arguments;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          level = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 0;
          inputFiles = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : '.';
          fullOutputFile = (0, _fileUtils.getAbsoluteFilePath)(outputFile);
          args = ["-".concat(level), '-r', fullOutputFile, inputFiles];
          childProcess = new _workerUtils.ChildProcessProxy();
          _context4.next = 7;
          return childProcess.start({
            command: 'zip',
            arguments: args,
            spawn: {
              cwd: inputFolder
            },
            wait: 0
          });
        case 7:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _compressWithChildProcessUnix.apply(this, arguments);
}
function compressWithChildProcessWindows(_x10, _x11) {
  return _compressWithChildProcessWindows.apply(this, arguments);
}
function _compressWithChildProcessWindows() {
  _compressWithChildProcessWindows = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(inputFolder, outputFile) {
    var level,
      inputFiles,
      sevenZipExe,
      fullOutputFile,
      args,
      childProcess,
      _args5 = arguments;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          level = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 0;
          inputFiles = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : (0, _path.join)('.', '*');
          sevenZipExe = _args5.length > 4 ? _args5[4] : undefined;
          if (inputFiles[0] === '@') {
            inputFiles = "*".concat(inputFiles.substr(1));
          }
          fullOutputFile = (0, _fileUtils.getAbsoluteFilePath)(outputFile);
          args = ['a', '-tzip', "-mx=".concat(level), fullOutputFile, inputFiles];
          childProcess = new _workerUtils.ChildProcessProxy();
          _context5.next = 9;
          return childProcess.start({
            command: sevenZipExe,
            arguments: args,
            spawn: {
              cwd: "".concat(inputFolder)
            },
            wait: 0
          });
        case 9:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _compressWithChildProcessWindows.apply(this, arguments);
}
function generateHash128FromZip(_x12, _x13) {
  return _generateHash128FromZip.apply(this, arguments);
}
function _generateHash128FromZip() {
  _generateHash128FromZip = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6(inputZipFile, outputFile) {
    var input, zip, hashTable, zipFiles, relativePath, zipEntry, _data, content, hash, output;
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return _fs.promises.readFile(inputZipFile);
        case 2:
          input = _context6.sent;
          _context6.next = 5;
          return _jszip.default.loadAsync(input);
        case 5:
          zip = _context6.sent;
          hashTable = [];
          zipFiles = zip.files;
          _context6.t0 = _regenerator.default.keys(zipFiles);
        case 9:
          if ((_context6.t1 = _context6.t0()).done) {
            _context6.next = 22;
            break;
          }
          relativePath = _context6.t1.value;
          zipEntry = zipFiles[relativePath];
          _data = '_data';
          content = zipEntry[_data].compressedContent;
          if (!zipEntry.dir) {
            _context6.next = 16;
            break;
          }
          return _context6.abrupt("continue", 9);
        case 16:
          _context6.next = 18;
          return new _crypto.MD5Hash().hash(Buffer.from(relativePath.toLowerCase()));
        case 18:
          hash = _context6.sent;
          hashTable.push({
            key: atob(hash),
            value: content.byteOffset
          });
          _context6.next = 9;
          break;
        case 22:
          hashTable.sort(function (prev, next) {
            if (prev.key === next.key) {
              return prev.value < next.value ? -1 : 1;
            }
            return prev.key < next.key ? -1 : 1;
          });
          output = (0, _fs.createWriteStream)(outputFile);
          return _context6.abrupt("return", new Promise(function (resolve, reject) {
            output.on('close', function () {
              console.log("".concat(outputFile, " generated and saved"));
              resolve(null);
            });
            output.on('error', function (err) {
              console.log(err);
              reject(err);
            });
            for (var _key in hashTable) {
              var item = hashTable[_key];
              var value = longToByteArray(item.value);
              output.write(Buffer.from(_crypt.default.hexToBytes(item.key).concat(value)));
            }
            output.close();
          }));
        case 25:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _generateHash128FromZip.apply(this, arguments);
}
function longToByteArray(long) {
  var buffer = new ArrayBuffer(8);
  var longNum = new Float64Array(buffer);
  longNum[0] = parseInt(long);
  return Array.from(new Uint8Array(buffer)).reverse();
}
function addFileToZip(_x14, _x15, _x16, _x17) {
  return _addFileToZip.apply(this, arguments);
}
function _addFileToZip() {
  _addFileToZip = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7(inputFolder, fileName, zipFile, sevenZipExe) {
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return compressWithChildProcess(inputFolder, zipFile, 0, fileName, sevenZipExe);
        case 2:
          console.log("".concat(fileName, " added to ").concat(zipFile, "."));
        case 3:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _addFileToZip.apply(this, arguments);
}
function appendFileToArchive(archive, subFileName, subFileData) {
  return new Promise(function (resolve) {
    var fileStream = (0, _fs.createReadStream)(subFileData);
    console.log("Compression start: ".concat(subFileName));
    fileStream.on('close', function () {
      console.log("Compression finish: ".concat(subFileName));
      resolve(null);
    });
    archive.append(fileStream, {
      name: subFileName
    });
  });
}
//# sourceMappingURL=compress-util.js.map