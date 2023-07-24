"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
require("@loaders.gl/polyfills");
const slpk_extractor_1 = __importDefault(require("./slpk-extractor/slpk-extractor"));
const cli_utils_1 = require("./lib/utils/cli-utils");
/**
 * CLI entry
 * @returns
 */
async function main() {
    const [, , ...args] = process.argv;
    if (args.length === 0) {
        printHelp();
    }
    const validatedOptionsArr = (0, cli_utils_1.validateOptionsWithEqual)(args);
    const options = parseOptions(validatedOptionsArr);
    const validatedOptions = validateOptions(options);
    await convert(validatedOptions);
}
main().catch((error) => {
    console.log(error);
    process.exit(1); // eslint-disable-line
});
/**
 * Output for `npx slpk-extractor --help`
 */
function printHelp() {
    console.log('cli: converter slpk to I3S...');
    console.log('--output [Output folder, default: "data" folder]');
    console.log('--tileset [SLPK file]');
    process.exit(0); // eslint-disable-line
}
/**
 * Run extraction process
 * @param options validated slpk-extractor options
 */
async function convert(options) {
    console.log(`------------------------------------------------`); // eslint-disable-line
    console.log(`Starting conversion of SLPK`); // eslint-disable-line
    console.log(`------------------------------------------------`); // eslint-disable-line
    const slpkExtractor = new slpk_extractor_1.default();
    slpkExtractor.extract({
        inputUrl: options.tileset,
        outputPath: options.output
    });
}
// OPTIONS
/**
 * Validate input options of the CLI command
 * @param options - input options of the CLI command
 * @returns validated options
 */
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
        exceptions.forEach((exeption) => exeption());
        process.exit(1);
    }
    return options;
}
/**
 * Parse option from the cli arguments array
 * @param args
 * @returns
 */
function parseOptions(args) {
    const opts = {};
    // eslint-disable-next-line complexity
    args.forEach((arg, index) => {
        if (arg.indexOf('--') === 0) {
            switch (arg) {
                case '--tileset':
                    opts.tileset = (0, cli_utils_1.getURLValue)(index, args);
                    break;
                case '--output':
                    opts.output = (0, cli_utils_1.getURLValue)(index, args);
                    break;
                case '--help':
                    printHelp();
                    break;
                default:
                    console.warn(`Unknown option ${arg}`);
                    process.exit(0); // eslint-disable-line
            }
        }
    });
    return opts;
}
