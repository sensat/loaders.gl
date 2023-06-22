const path = require('path');
const fs = require('fs');
const {
  promises
} = fs;
const I3S_LAYER_PATH = process.env.I3sLayerPath || '';
const FULL_LAYER_PATH = path.join(process.cwd(), I3S_LAYER_PATH);
async function getFileNameByUrl(url) {
  const extensions = ['json', 'bin', 'jpg', 'jpeg', 'png', 'bin.dds', 'ktx2'];
  for (const ext of extensions) {
    const fileName = "".concat(FULL_LAYER_PATH).concat(url, "/index.").concat(ext);
    try {
      await promises.access(fileName);
      return fileName;
    } catch {
      continue;
    }
  }
  return null;
}
module.exports = {
  getFileNameByUrl
};
//# sourceMappingURL=index-controller.js.map