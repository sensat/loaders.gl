import '@loaders.gl/polyfills';
import SLPKExtractor from './slpk-extractor/slpk-extractor';
import { getURLValue, validateOptionsWithEqual } from './lib/utils/cli-utils';
async function main() {
  const [,, ...args] = process.argv;
  if (args.length === 0) {
    printHelp();
  }
  const validatedOptionsArr = validateOptionsWithEqual(args);
  const options = parseOptions(validatedOptionsArr);
  const validatedOptions = validateOptions(options);
  await convert(validatedOptions);
}
main().catch(error => {
  console.log(error);
  process.exit(1);
});
function printHelp() {
  console.log('cli: converter slpk to I3S...');
  console.log('--output [Output folder, default: "data" folder]');
  console.log('--tileset [SLPK file]');
  process.exit(0);
}
async function convert(options) {
  console.log("------------------------------------------------");
  console.log("Starting conversion of SLPK");
  console.log("------------------------------------------------");
  const slpkExtractor = new SLPKExtractor();
  slpkExtractor.extract({
    inputUrl: options.tileset,
    outputPath: options.output
  });
}
function validateOptions(options) {
  const mandatoryOptionsWithExceptions = {
    output: () => console.log('Missed: --output [Output path name]'),
    tileset: () => console.log('Missed: --tileset [SLPK file]')
  };
  const exceptions = [];
  for (const mandatoryOption in mandatoryOptionsWithExceptions) {
    const optionValue = options[mandatoryOption];
    if (!optionValue) {
      exceptions.push(mandatoryOptionsWithExceptions[mandatoryOption]);
    }
  }
  if (exceptions.length) {
    exceptions.forEach(exeption => exeption());
    process.exit(1);
  }
  return options;
}
function parseOptions(args) {
  const opts = {};
  args.forEach((arg, index) => {
    if (arg.indexOf('--') === 0) {
      switch (arg) {
        case '--tileset':
          opts.tileset = getURLValue(index, args);
          break;
        case '--output':
          opts.output = getURLValue(index, args);
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