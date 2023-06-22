import { load, fetchFile } from '@loaders.gl/core';
import { ZipLoader } from '@loaders.gl/zip';
import { writeFile } from '../lib/utils/file-utils';
import { join } from 'path';
import { ChildProcessProxy } from '@loaders.gl/worker-utils';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'beta';
const PGM_LINK = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/egm/egm2008-5.zip';
export class DepsInstaller {
  async install() {
    let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let workersPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    console.log('Installing "EGM2008-5" model...');
    const fileMap = await load(PGM_LINK, ZipLoader, {});
    let depsPath = process.cwd();
    if (path) {
      depsPath = join(depsPath, path);
    }
    await writeFile(depsPath, new Uint8Array(fileMap['geoids/egm2008-5.pgm']), 'egm2008-5.pgm');
    console.log('Installing "I3S Content Loader worker"');
    await this.installWorker('i3s', 'i3s-content-worker-node.js', workersPath);
    console.log('Installing "Draco Loader worker"');
    await this.installWorker('draco', 'draco-worker-node.js', workersPath);
    console.log('Installing "Basis Loader worker"');
    await this.installWorker('textures', 'basis-worker-node.js', workersPath);
    console.log('Installing "join-images" npm package');
    const childProcess = new ChildProcessProxy();
    await childProcess.start({
      command: 'npm',
      arguments: ['install', 'sharp@0.30.4', 'join-images@1.1.3'],
      wait: 0
    });
    console.log('All dependencies were installed succesfully.');
  }
  async installWorker(module, name, extraPath) {
    const fileResponse = await fetchFile("https://unpkg.com/@loaders.gl/".concat(module, "@").concat(VERSION, "/dist/").concat(name));
    const fileData = await fileResponse.arrayBuffer();
    if (!fileData) {
      return;
    }
    const path = join(process.cwd(), extraPath, 'modules', module, 'dist');
    await writeFile(path, fileData, name);
  }
}
//# sourceMappingURL=deps-installer.js.map