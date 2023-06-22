import { fs } from '@loaders.gl/loader-utils';
export function load(name) {
  return (module || global).require(name);
}
export function oswrite(os, buf) {
  return new Promise((resolve, reject) => {
    os.write(buf, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
export function osclose(os) {
  return new Promise((resolve, reject) => {
    os.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
export function osopen(path, opts) {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(path, opts);
    outputStream.once('open', fd => resolve(outputStream));
    outputStream.once('error', err => reject(err));
  });
}
//# sourceMappingURL=file-utils.js.map