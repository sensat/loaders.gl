import '@loaders.gl/polyfills';
import { join } from 'path';
import { I3SConverter, Tiles3DConverter } from '@loaders.gl/tile-converter';
import { DepsInstaller } from './deps-installer/deps-installer';
const TILESET_TYPE = {
  I3S: 'I3S',
  _3DTILES: '3DTILES'
};
async function main() {
  const [,, ...args] = process.argv;
  if (args.length === 0) {
    printHelp();
  }
  const validatedOptionsArr = validateOptionsWithEqual(args);
  const options = parseOptions(validatedOptionsArr);
  if (options.installDependencies) {
    const depthInstaller = new DepsInstaller();
    depthInstaller.install('deps');
    return;
  }
  const validatedOptions = validateOptions(options);
  await convert(validatedOptions);
}
main().catch(error => {
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
async function convert(options) {
  console.log("------------------------------------------------");
  console.log("Starting conversion of ".concat(options.inputType));
  console.log("------------------------------------------------");
  const inputType = options.inputType.toUpperCase();
  switch (inputType) {
    case TILESET_TYPE.I3S:
      const tiles3DConverter = new Tiles3DConverter();
      tiles3DConverter.convert({
        inputUrl: options.tileset,
        outputPath: options.output,
        tilesetName: options.name,
        maxDepth: options.maxDepth,
        egmFilePath: options.egm
      });
      break;
    case TILESET_TYPE._3DTILES:
      const converter = new I3SConverter();
      await converter.convert({
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
      break;
    default:
      printHelp();
  }
}
function validateOptions(options) {
  const mandatoryOptionsWithExceptions = {
    name: () => console.log('Missed: --name [Tileset name]'),
    output: () => console.log('Missed: --output [Output path name]'),
    sevenZipExe: () => console.log('Missed: --7zExe [7z archiver executable path]'),
    egm: () => console.log('Missed: --egm [*.pgm earth gravity model file path]'),
    tileset: () => console.log('Missed: --tileset [tileset.json file]'),
    inputType: () => console.log('Missed/Incorrect: --input-type [tileset input type: I3S or 3DTILES]')
  };
  const exceptions = [];
  for (const mandatoryOption in mandatoryOptionsWithExceptions) {
    const optionValue = options[mandatoryOption];
    const isWrongInputType = Boolean(optionValue) && mandatoryOption === 'inputType' && !Object.values(TILESET_TYPE).includes(optionValue.toUpperCase());
    if (!optionValue || isWrongInputType) {
      exceptions.push(mandatoryOptionsWithExceptions[mandatoryOption]);
    }
  }
  if (exceptions.length) {
    exceptions.forEach(exeption => exeption());
    process.exit(1);
  }
  return options;
}
function validateOptionsWithEqual(args) {
  return args.reduce((acc, curr) => {
    const equalSignIndex = curr.indexOf('=');
    const beforeEqual = curr.slice(0, equalSignIndex);
    const afterEqual = curr.slice(equalSignIndex + 1, curr.length);
    const condition = curr.includes('=') && curr.startsWith('--') && afterEqual;
    if (condition) {
      return acc.concat(beforeEqual, afterEqual);
    }
    return acc.concat(curr);
  }, []);
}
function parseOptions(args) {
  const opts = {
    output: 'data',
    instantNodeWriting: false,
    mergeMaterials: true,
    sevenZipExe: 'C:\\Program Files\\7-Zip\\7z.exe',
    egm: join(process.cwd(), 'deps', 'egm2008-5.pgm'),
    draco: true,
    installDependencies: false,
    generateTextures: false,
    generateBoundingVolumes: false,
    validate: false,
    slpk: false
  };
  args.forEach((arg, index) => {
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
  const value = args[index + 1];
  if (value.indexOf('--') === 0) {
    return '';
  }
  return value;
}
function getURLValue(index, args) {
  const value = getStringValue(index, args);
  console.log("Input tileset value: ".concat(value));
  console.log("Modified tileset value: ".concat(value.replace(/\\/g, '/')));
  return value.replace(/\\/g, '/');
}
function getIntegerValue(index, args) {
  const stringValue = getStringValue(index, args);
  const result = Number.parseInt(stringValue);
  if (isFinite(result)) {
    return result;
  }
  return NaN;
}
function getBooleanValue(index, args) {
  const stringValue = getStringValue(index, args).toLowerCase().trim();
  if (['--no-draco', '--split-nodes'].includes(args[index]) && !stringValue) {
    return false;
  }
  if (!stringValue || stringValue === 'true') {
    return true;
  }
  return false;
}
//# sourceMappingURL=converter-cli.js.map