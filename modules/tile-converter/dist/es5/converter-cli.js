"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
require("@loaders.gl/polyfills");
var _path = require("path");
var _tileConverter = require("@loaders.gl/tile-converter");
var _depsInstaller = require("./deps-installer/deps-installer");
var TILESET_TYPE = {
  I3S: 'I3S',
  _3DTILES: '3DTILES'
};
function main() {
  return _main.apply(this, arguments);
}
function _main() {
  _main = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
    var _process$argv, args, validatedOptionsArr, options, depthInstaller, validatedOptions;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _process$argv = (0, _toArray2.default)(process.argv), args = _process$argv.slice(2);
          if (args.length === 0) {
            printHelp();
          }
          validatedOptionsArr = validateOptionsWithEqual(args);
          options = parseOptions(validatedOptionsArr);
          if (!options.installDependencies) {
            _context.next = 8;
            break;
          }
          depthInstaller = new _depsInstaller.DepsInstaller();
          depthInstaller.install('deps');
          return _context.abrupt("return");
        case 8:
          validatedOptions = validateOptions(options);
          _context.next = 11;
          return convert(validatedOptions);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _main.apply(this, arguments);
}
main().catch(function (error) {
  console.log(error);
  process.exit(1);
});
function printHelp() {
  console.log('cli: converter 3dTiles to I3S or I3S to 3dTiles...');
  console.log('--install-dependencies [Run the script for installing dependencies. Run this options separate from others. Now "*.pgm" file installation is implemented]');
  console.log('--max-depth [Maximal depth of hierarchical tiles tree traversal, default: infinite]');
  console.log('--name [Tileset name]');
  console.log('--output [Output folder, default: "data" folder]');
  console.log('--instant-node-writing [Keep created 3DNodeIndexDocument files on disk instead of memory. This option reduce memory usage but decelerates conversion speed]');
  console.log('--split-nodes [Prevent to merge similar materials that could lead to incorrect visualization (I3S to 3DTiles conversion only)]');
  console.log('--slpk [Generate slpk (Scene Layer Packages) I3S output file]');
  console.log('--tileset [tileset.json file (3DTiles) / http://..../SceneServer/layers/0 resource (I3S)]');
  console.log('--input-type [tileset input type: I3S or 3DTILES]');
  console.log('--7zExe [location of 7z.exe archiver to create slpk on Windows, default: "C:\\Program Files\\7-Zip\\7z.exe"]');
  console.log('--egm [location of Earth Gravity Model *.pgm file to convert heights from ellipsoidal to gravity-related format. A model file can be loaded from GeographicLib https://geographiclib.sourceforge.io/html/geoid.html], default: "./deps/egm2008-5.zip"');
  console.log('--token [Token for Cesium ION tilesets authentication]');
  console.log('--no-draco [Disable draco compression for geometry]');
  console.log('--generate-textures [Enable KTX2 textures generation if only one of (JPG, PNG) texture is provided or generate JPG texture if only KTX2 is provided]');
  console.log('--generate-bounding-volumes [Will generate obb and mbs bounding volumes from geometry]');
  console.log('--validate [Enable validation]');
  process.exit(0);
}
function convert(_x) {
  return _convert.apply(this, arguments);
}
function _convert() {
  _convert = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(options) {
    var inputType, tiles3DConverter, converter;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log("------------------------------------------------");
          console.log("Starting conversion of ".concat(options.inputType));
          console.log("------------------------------------------------");
          inputType = options.inputType.toUpperCase();
          _context2.t0 = inputType;
          _context2.next = _context2.t0 === TILESET_TYPE.I3S ? 7 : _context2.t0 === TILESET_TYPE._3DTILES ? 10 : 14;
          break;
        case 7:
          tiles3DConverter = new _tileConverter.Tiles3DConverter();
          tiles3DConverter.convert({
            inputUrl: options.tileset,
            outputPath: options.output,
            tilesetName: options.name,
            maxDepth: options.maxDepth,
            egmFilePath: options.egm
          });
          return _context2.abrupt("break", 15);
        case 10:
          converter = new _tileConverter.I3SConverter();
          _context2.next = 13;
          return converter.convert({
            inputUrl: options.tileset,
            outputPath: options.output,
            tilesetName: options.name,
            maxDepth: options.maxDepth,
            slpk: options.slpk,
            sevenZipExe: options.sevenZipExe,
            egmFilePath: options.egm,
            token: options.token,
            draco: options.draco,
            mergeMaterials: options.mergeMaterials,
            generateTextures: options.generateTextures,
            generateBoundingVolumes: options.generateBoundingVolumes,
            validate: options.validate,
            instantNodeWriting: options.instantNodeWriting
          });
        case 13:
          return _context2.abrupt("break", 15);
        case 14:
          printHelp();
        case 15:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _convert.apply(this, arguments);
}
function validateOptions(options) {
  var mandatoryOptionsWithExceptions = {
    name: function name() {
      return console.log('Missed: --name [Tileset name]');
    },
    output: function output() {
      return console.log('Missed: --output [Output path name]');
    },
    sevenZipExe: function sevenZipExe() {
      return console.log('Missed: --7zExe [7z archiver executable path]');
    },
    egm: function egm() {
      return console.log('Missed: --egm [*.pgm earth gravity model file path]');
    },
    tileset: function tileset() {
      return console.log('Missed: --tileset [tileset.json file]');
    },
    inputType: function inputType() {
      return console.log('Missed/Incorrect: --input-type [tileset input type: I3S or 3DTILES]');
    }
  };
  var exceptions = [];
  for (var mandatoryOption in mandatoryOptionsWithExceptions) {
    var optionValue = options[mandatoryOption];
    var isWrongInputType = Boolean(optionValue) && mandatoryOption === 'inputType' && !Object.values(TILESET_TYPE).includes(optionValue.toUpperCase());
    if (!optionValue || isWrongInputType) {
      exceptions.push(mandatoryOptionsWithExceptions[mandatoryOption]);
    }
  }
  if (exceptions.length) {
    exceptions.forEach(function (exeption) {
      return exeption();
    });
    process.exit(1);
  }
  return options;
}
function validateOptionsWithEqual(args) {
  return args.reduce(function (acc, curr) {
    var equalSignIndex = curr.indexOf('=');
    var beforeEqual = curr.slice(0, equalSignIndex);
    var afterEqual = curr.slice(equalSignIndex + 1, curr.length);
    var condition = curr.includes('=') && curr.startsWith('--') && afterEqual;
    if (condition) {
      return acc.concat(beforeEqual, afterEqual);
    }
    return acc.concat(curr);
  }, []);
}
function parseOptions(args) {
  var opts = {
    output: 'data',
    instantNodeWriting: false,
    mergeMaterials: true,
    sevenZipExe: 'C:\\Program Files\\7-Zip\\7z.exe',
    egm: (0, _path.join)(process.cwd(), 'deps', 'egm2008-5.pgm'),
    draco: true,
    installDependencies: false,
    generateTextures: false,
    generateBoundingVolumes: false,
    validate: false,
    slpk: false
  };
  args.forEach(function (arg, index) {
    if (arg.indexOf('--') === 0) {
      switch (arg) {
        case '--input-type':
          opts.inputType = getStringValue(index, args);
          break;
        case '--tileset':
          opts.tileset = getURLValue(index, args);
          break;
        case '--name':
          opts.name = getStringValue(index, args);
          break;
        case '--output':
          opts.output = getStringValue(index, args);
          break;
        case '--instant-node-writing':
          opts.instantNodeWriting = getBooleanValue(index, args);
          break;
        case '--split-nodes':
          opts.mergeMaterials = getBooleanValue(index, args);
          break;
        case '--max-depth':
          opts.maxDepth = getIntegerValue(index, args);
          break;
        case '--slpk':
          opts.slpk = getBooleanValue(index, args);
          break;
        case '--7zExe':
          opts.sevenZipExe = getStringValue(index, args);
          break;
        case '--egm':
          opts.egm = getStringValue(index, args);
          break;
        case '--token':
          opts.token = getStringValue(index, args);
          break;
        case '--no-draco':
          opts.draco = getBooleanValue(index, args);
          break;
        case '--validate':
          opts.validate = getBooleanValue(index, args);
          break;
        case '--install-dependencies':
          opts.installDependencies = getBooleanValue(index, args);
          break;
        case '--generate-textures':
          opts.generateTextures = getBooleanValue(index, args);
          break;
        case '--generate-bounding-volumes':
          opts.generateBoundingVolumes = getBooleanValue(index, args);
          break;
        case '--help':
          printHelp();
          break;
        default:
          console.warn("Unknown option ".concat(arg));
          process.exit(0);
      }
    }
  });
  return opts;
}
function getStringValue(index, args) {
  if (index + 1 >= args.length) {
    return '';
  }
  var value = args[index + 1];
  if (value.indexOf('--') === 0) {
    return '';
  }
  return value;
}
function getURLValue(index, args) {
  var value = getStringValue(index, args);
  console.log("Input tileset value: ".concat(value));
  console.log("Modified tileset value: ".concat(value.replace(/\\/g, '/')));
  return value.replace(/\\/g, '/');
}
function getIntegerValue(index, args) {
  var stringValue = getStringValue(index, args);
  var result = Number.parseInt(stringValue);
  if (isFinite(result)) {
    return result;
  }
  return NaN;
}
function getBooleanValue(index, args) {
  var stringValue = getStringValue(index, args).toLowerCase().trim();
  if (['--no-draco', '--split-nodes'].includes(args[index]) && !stringValue) {
    return false;
  }
  if (!stringValue || stringValue === 'true') {
    return true;
  }
  return false;
}
//# sourceMappingURL=converter-cli.js.map