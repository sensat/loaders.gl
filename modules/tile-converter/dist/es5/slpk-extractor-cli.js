"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
require("@loaders.gl/polyfills");
var _slpkExtractor = _interopRequireDefault(require("./slpk-extractor/slpk-extractor"));
var _cliUtils = require("./lib/utils/cli-utils");
function main() {
  return _main.apply(this, arguments);
}
function _main() {
  _main = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
    var _process$argv, args, validatedOptionsArr, options, validatedOptions;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _process$argv = (0, _toArray2.default)(process.argv), args = _process$argv.slice(2);
          if (args.length === 0) {
            printHelp();
          }
          validatedOptionsArr = (0, _cliUtils.validateOptionsWithEqual)(args);
          options = parseOptions(validatedOptionsArr);
          validatedOptions = validateOptions(options);
          _context.next = 7;
          return convert(validatedOptions);
        case 7:
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
  console.log('cli: converter slpk to I3S...');
  console.log('--output [Output folder, default: "data" folder]');
  console.log('--tileset [SLPK file]');
  process.exit(0);
}
function convert(_x) {
  return _convert.apply(this, arguments);
}
function _convert() {
  _convert = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(options) {
    var slpkExtractor;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log("------------------------------------------------");
          console.log("Starting conversion of SLPK");
          console.log("------------------------------------------------");
          slpkExtractor = new _slpkExtractor.default();
          slpkExtractor.extract({
            inputUrl: options.tileset,
            outputPath: options.output
          });
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _convert.apply(this, arguments);
}
function validateOptions(options) {
  var mandatoryOptionsWithExceptions = {
    output: function output() {
      return console.log('Missed: --output [Output path name]');
    },
    tileset: function tileset() {
      return console.log('Missed: --tileset [SLPK file]');
    }
  };
  var exceptions = [];
  for (var mandatoryOption in mandatoryOptionsWithExceptions) {
    var optionValue = options[mandatoryOption];
    if (!optionValue) {
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
function parseOptions(args) {
  var opts = {};
  args.forEach(function (arg, index) {
    if (arg.indexOf('--') === 0) {
      switch (arg) {
        case '--tileset':
          opts.tileset = (0, _cliUtils.getURLValue)(index, args);
          break;
        case '--output':
          opts.output = (0, _cliUtils.getURLValue)(index, args);
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
//# sourceMappingURL=slpk-extractor-cli.js.map