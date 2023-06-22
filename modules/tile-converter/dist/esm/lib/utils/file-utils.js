import { load } from '@loaders.gl/core';
import { JSONLoader } from '@loaders.gl/loader-utils';
import { promises as fs } from 'fs';
import { isAbsolute, join } from 'path';
import { compressFileWithGzip } from './compress-util';
export async function writeFile(path, data) {
  let fileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'index.json';
  let toWriteData;
  if (data instanceof Promise) {
    toWriteData = new Uint8Array(await data);
  } else if (data instanceof ArrayBuffer) {
    toWriteData = new Uint8Array(data);
  } else {
    toWriteData = data;
  }
  await fs.mkdir(path, {
    recursive: true
  });
  const pathFile = join(path, fileName);
  try {
    await fs.writeFile(pathFile, toWriteData);
  } catch (err) {
    throw err;
  }
  console.log("".concat(pathFile, " saved."));
  return pathFile;
}
export async function writeFileForSlpk(path, data) {
  let fileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'index.json';
  let compress = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  let compressList = arguments.length > 4 ? arguments[4] : undefined;
  const pathFile = await writeFile(path, data, fileName);
  if (compress) {
    if (compressList) {
      if (!compressList.includes(pathFile)) {
        compressList.push(pathFile);
        return "".concat(pathFile, ".gz");
      } else {
        return null;
      }
    } else {
      const pathGzFile = await compressFileWithGzip(pathFile);
      await removeFile(pathFile);
      return pathGzFile;
    }
  }
  return pathFile;
}
export async function openJson(path, fileName) {
  return new Promise((resolve, reject) => {
    let count = 0;
    console.log("load ".concat(path, "/").concat(fileName, "."));
    const intervalId = setInterval(() => {
      const pathFile = join(path, fileName);
      load(pathFile, JSONLoader).then(result => {
        clearInterval(intervalId);
        resolve(result);
      }).catch(() => {
        count++;
        if (count > 100) {
          clearInterval(intervalId);
          reject(new Error("Cannon load ".concat(path, "/").concat(fileName, ".")));
        }
      });
    }, 200);
  });
}
export async function isFileExists(fileName) {
  try {
    await fs.stat(fileName);
    return true;
  } catch {
    return false;
  }
}
export function removeDir(path) {
  return fs.rm(path, {
    recursive: true
  });
}
export function removeFile(path) {
  return fs.unlink(path);
}
export function getAbsoluteFilePath(filePath) {
  return isAbsolute(filePath) ? filePath : join(process.cwd(), filePath);
}
//# sourceMappingURL=file-utils.js.map