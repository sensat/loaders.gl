import { assert } from './lib/utils/assert';
import gifshot from './lib/gifshot/gifshot';
const GIF_BUILDER_OPTIONS = {
  source: 'images',
  width: 200,
  height: 200,
  crossOrigin: 'Anonymous',
  progressCallback: captureProgress => {},
  completeCallback: () => {},
  numWorkers: 2,
  sampleInterval: 10,
  interval: 0.1,
  offset: null,
  numFrames: 10,
  frameDuration: 1,
  filter: '',
  waterMark: null,
  waterMarkHeight: null,
  waterMarkWidth: null,
  waterMarkXCoordinate: 1,
  waterMarkYCoordinate: 1,
  text: '',
  showFrameText: true,
  fontWeight: 'normal',
  fontSize: '16px',
  minFontSize: '10px',
  resizeFont: false,
  fontFamily: 'sans-serif',
  fontColor: '#ffffff',
  textAlign: 'center',
  textBaseline: 'bottom',
  textXCoordinate: null,
  textYCoordinate: null,
  webcamVideoElement: null,
  keepCameraOn: false,
  cameraStream: null,
  saveRenderingContexts: false,
  savedRenderingContexts: []
};
export default class GIFBuilder {
  static get properties() {
    return {
      id: 'gif',
      name: 'GIF',
      extensions: ['gif'],
      mimeTypes: ['image/gif'],
      builder: GIFBuilder,
      options: GIF_BUILDER_OPTIONS
    };
  }
  constructor(options) {
    this.options = {
      ...options
    };
    this.source = options.source;
    delete options.source;
    this.files = [];
    this.gifshot = gifshot;
  }
  async initialize(options) {}
  async add(file) {
    await this.initialize();
    this.files.push(file);
  }
  async build() {
    await this.initialize();
    this._cleanOptions(this.options);
    switch (this.source) {
      case 'images':
        this.options.images = this.files;
        break;
      case 'video':
        this.options.video = this.files;
        break;
      case 'webcam':
        assert(this.files.length === 0);
        break;
      default:
        throw new Error('GIFBuilder: invalid source');
    }
    return await this._createGIF();
  }
  async _createGIF() {
    return new Promise((resolve, reject) => {
      this.gifshot.createGIF(this.options, result => {
        if (result.error) {
          reject(result.errorMsg);
          return;
        }
        resolve(result.image);
      });
    });
  }
  _cleanOptions(options) {
    if (options.video || options.images || options.gifWidth || options.gifHeight) {
      console.warn('GIFBuilder: ignoring options');
    }
    delete options.video;
    delete options.images;
    options.gifWidth = options.width;
    options.gifHeight = options.height;
    delete options.width;
    delete options.height;
  }
}
//# sourceMappingURL=gif-builder.js.map