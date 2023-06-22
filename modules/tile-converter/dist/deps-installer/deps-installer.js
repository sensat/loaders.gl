"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepsInstaller = void 0;
const core_1 = require("@loaders.gl/core");
const zip_1 = require("@loaders.gl/zip");
const file_utils_1 = require("../lib/utils/file-utils");
const path_1 = require("path");
const worker_utils_1 = require("@loaders.gl/worker-utils");
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'beta';
const PGM_LINK = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/egm/egm2008-5.zip';
/**
 * Install external dependencies for converter:
 * * PGM file (implemented);
 * * Draco library (not implemented);
 * * 7z archiver (not implemented);
 */
class DepsInstaller {
    /**
     * Run instalation
     * @param path destination folder
     * @param workersPath destination folder for workers.
     *    This path is '' by default and is not used by tile-converter.
     *    It is used in tests to prevent rewriting actual workers during tests running
     */
    async install(path = '', workersPath = '') {
        console.log('Installing "EGM2008-5" model...'); // eslint-disable-line no-console
        const fileMap = await (0, core_1.load)(PGM_LINK, zip_1.ZipLoader, {});
        let depsPath = process.cwd();
        if (path) {
            depsPath = (0, path_1.join)(depsPath, path);
        }
        await (0, file_utils_1.writeFile)(depsPath, new Uint8Array(fileMap['geoids/egm2008-5.pgm']), 'egm2008-5.pgm');
        console.log('Installing "I3S Content Loader worker"'); // eslint-disable-line no-console
        await this.installWorker('i3s', 'i3s-content-worker-node.js', workersPath);
        console.log('Installing "Draco Loader worker"'); // eslint-disable-line no-console
        await this.installWorker('draco', 'draco-worker-node.js', workersPath);
        console.log('Installing "Basis Loader worker"'); // eslint-disable-line no-console
        await this.installWorker('textures', 'basis-worker-node.js', workersPath);
        console.log('Installing "join-images" npm package');
        const childProcess = new worker_utils_1.ChildProcessProxy();
        await childProcess.start({
            command: 'npm',
            // `npm install sharp join-images` works unstable. It fails because installed `sharp` version
            // may be different from the version required by `join-images`. Pointing to specific versions
            // resolve this issue
            arguments: ['install', 'sharp@0.30.4', 'join-images@1.1.3'],
            wait: 0
        });
        console.log('All dependencies were installed succesfully.'); // eslint-disable-line no-console
    }
    async installWorker(module, name, extraPath) {
        const fileResponse = await (0, core_1.fetchFile)(`https://unpkg.com/@loaders.gl/${module}@${VERSION}/dist/${name}`);
        const fileData = await fileResponse.arrayBuffer();
        if (!fileData) {
            return;
        }
        const path = (0, path_1.join)(process.cwd(), extraPath, 'modules', module, 'dist');
        await (0, file_utils_1.writeFile)(path, fileData, name);
    }
}
exports.DepsInstaller = DepsInstaller;
