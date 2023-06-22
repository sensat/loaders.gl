"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// A GIFBuilder based on the gifshot module
// @ts-nocheck
const assert_1 = require("./lib/utils/assert");
const gifshot_1 = __importDefault(require("./lib/gifshot/gifshot")); // TODO - load dynamically to avoid bloating
// These are gifshot module options
const GIF_BUILDER_OPTIONS = {
    source: 'images',
    width: 200,
    height: 200,
    crossOrigin: 'Anonymous',
    // CALLBACKS
    progressCallback: (captureProgress) => { },
    completeCallback: () => { },
    // QUALITY SETTINGS
    numWorkers: 2,
    sampleInterval: 10,
    interval: 0.1,
    offset: null,
    numFrames: 10,
    frameDuration: 1,
    // CSS FILTER OPTIONS
    filter: '',
    // WATERMARK OPTIONS
    waterMark: null,
    waterMarkHeight: null,
    waterMarkWidth: null,
    waterMarkXCoordinate: 1,
    waterMarkYCoordinate: 1,
    // TEXT OPTIONS
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
    // ADVANCED OPTIONS
    // WEBCAM CAPTURE OPTIONS
    webcamVideoElement: null,
    keepCameraOn: false,
    cameraStream: null,
    // CANVAS OPTIMIZATION OPTIONS
    saveRenderingContexts: false,
    savedRenderingContexts: [] // Array of canvas image data
};
class GIFBuilder {
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
        this.options = { ...options };
        this.source = options.source;
        delete options.source;
        // Allow files to be added
        this.files = [];
        // Expose the gifshot module so that the full gifshot API is available to apps (Experimental)
        this.gifshot = gifshot_1.default;
    }
    async initialize(options) {
        // Expose the gifshot module so that the full gifshot API is available to apps (Experimental)
        // this.gifshot = await loadGifshotModule(options);
    }
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
                (0, assert_1.assert)(this.files.length === 0);
                break;
            default:
                throw new Error('GIFBuilder: invalid source');
        }
        return await this._createGIF();
    }
    // PRIVATE
    async _createGIF() {
        return new Promise((resolve, reject) => {
            this.gifshot.createGIF(this.options, (result) => {
                // callback object properties
                // --------------------------
                // image - Base 64 image
                // cameraStream - The webRTC MediaStream object
                // error - Boolean that determines if an error occurred
                // errorCode - Helpful error label
                // errorMsg - Helpful error message
                // savedRenderingContexts - An array of canvas image data (will only be set if the saveRenderingContexts option was used)
                if (result.error) {
                    reject(result.errorMsg);
                    return;
                }
                // image - Base 64 image
                resolve(result.image);
                // var image = obj.image,
                // animatedImage = document.createElement('img');
                // animatedImage.src = image;
                // document.body.appendChild(animatedImage);
            });
        });
    }
    // Remove some gifshot options
    _cleanOptions(options) {
        if (options.video || options.images || options.gifWidth || options.gifHeight) {
            console.warn('GIFBuilder: ignoring options'); // eslint-disable-line
        }
        // We control these through options.source instead
        delete options.video;
        delete options.images;
        // Use width/height props (to standardize across builders)
        options.gifWidth = options.width;
        options.gifHeight = options.height;
        delete options.width;
        delete options.height;
    }
}
exports.default = GIFBuilder;
