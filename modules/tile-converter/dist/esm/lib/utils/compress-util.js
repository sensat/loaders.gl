import { createGzip } from 'zlib';
import { join } from 'path';
import { promises as fs, createReadStream, createWriteStream } from 'fs';
import archiver from 'archiver';
import { removeFile } from './file-utils';
import { ChildProcessProxy } from '@loaders.gl/worker-utils';
import JSZip from 'jszip';
import { MD5Hash } from '@loaders.gl/crypto';
import crypt from 'crypt';
import { getAbsoluteFilePath } from './file-utils';
export function compressFileWithGzip(pathFile) {
  const compressedPathFile = "".concat(pathFile, ".gz");
  const gzip = createGzip();
  const input = createReadStream(pathFile);
  const output = createWriteStream(compressedPathFile);
  return new Promise((resolve, reject) => {
    input.on('end', () => {
      console.log("".concat(compressedPathFile, " compressed and saved."));
      resolve(compressedPathFile);
    });
    input.on('error', error => {
      console.log("".concat(compressedPathFile, ": compression error!"));
      reject(error);
    });
    input.pipe(gzip).pipe(output);
  });
}
export async function compressFilesWithZip(fileMap, outputFile) {
  let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  try {
    await removeFile(outputFile);
  } catch (e) {}
  const output = createWriteStream(outputFile);
  const archive = archiver('zip', {
    zlib: {
      level
    }
  });
  return new Promise(async (resolve, reject) => {
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
    for (const subFileName in fileMap) {
      const subFileData = fileMap[subFileName];
      await appendFileToArchive(archive, subFileName, subFileData);
    }
    archive.finalize();
  });
}
export async function compressWithChildProcess(inputFolder, outputFile, level, inputFiles, sevenZipExe) {
  if (process.platform === 'win32') {
    await compressWithChildProcessWindows(inputFolder, outputFile, level, inputFiles, sevenZipExe);
  } else {
    await compressWithChildProcessUnix(inputFolder, outputFile, level, inputFiles);
  }
}
async function compressWithChildProcessUnix(inputFolder, outputFile) {
  let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let inputFiles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
  const fullOutputFile = getAbsoluteFilePath(outputFile);
  const args = ["-".concat(level), '-r', fullOutputFile, inputFiles];
  const childProcess = new ChildProcessProxy();
  await childProcess.start({
    command: 'zip',
    arguments: args,
    spawn: {
      cwd: inputFolder
    },
    wait: 0
  });
}
async function compressWithChildProcessWindows(inputFolder, outputFile) {
  let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let inputFiles = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : join('.', '*');
  let sevenZipExe = arguments.length > 4 ? arguments[4] : undefined;
  if (inputFiles[0] === '@') {
    inputFiles = "*".concat(inputFiles.substr(1));
  }
  const fullOutputFile = getAbsoluteFilePath(outputFile);
  const args = ['a', '-tzip', "-mx=".concat(level), fullOutputFile, inputFiles];
  const childProcess = new ChildProcessProxy();
  await childProcess.start({
    command: sevenZipExe,
    arguments: args,
    spawn: {
      cwd: "".concat(inputFolder)
    },
    wait: 0
  });
}
export async function generateHash128FromZip(inputZipFile, outputFile) {
  const input = await fs.readFile(inputZipFile);
  const zip = await JSZip.loadAsync(input);
  const hashTable = [];
  const zipFiles = zip.files;
  for (const relativePath in zipFiles) {
    const zipEntry = zipFiles[relativePath];
    const _data = '_data';
    const content = zipEntry[_data].compressedContent;
    if (zipEntry.dir) continue;
    const hash = await new MD5Hash().hash(Buffer.from(relativePath.toLowerCase()));
    hashTable.push({
      key: atob(hash),
      value: content.byteOffset
    });
  }
  hashTable.sort((prev, next) => {
    if (prev.key === next.key) {
      return prev.value < next.value ? -1 : 1;
    }
    return prev.key < next.key ? -1 : 1;
  });
  const output = createWriteStream(outputFile);
  return new Promise((resolve, reject) => {
    output.on('close', function () {
      console.log("".concat(outputFile, " generated and saved"));
      resolve(null);
    });
    output.on('error', function (err) {
      console.log(err);
      reject(err);
    });
    for (const key in hashTable) {
      const item = hashTable[key];
      const value = longToByteArray(item.value);
      output.write(Buffer.from(crypt.hexToBytes(item.key).concat(value)));
    }
    output.close();
  });
}
function longToByteArray(long) {
  const buffer = new ArrayBuffer(8);
  const longNum = new Float64Array(buffer);
  longNum[0] = parseInt(long);
  return Array.from(new Uint8Array(buffer)).reverse();
}
export async function addFileToZip(inputFolder, fileName, zipFile, sevenZipExe) {
  await compressWithChildProcess(inputFolder, zipFile, 0, fileName, sevenZipExe);
  console.log("".concat(fileName, " added to ").concat(zipFile, "."));
}
function appendFileToArchive(archive, subFileName, subFileData) {
  return new Promise(resolve => {
    const fileStream = createReadStream(subFileData);
    console.log("Compression start: ".concat(subFileName));
    fileStream.on('close', () => {
      console.log("Compression finish: ".concat(subFileName));
      resolve(null);
    });
    archive.append(fileStream, {
      name: subFileName
    });
  });
}
//# sourceMappingURL=compress-util.js.map