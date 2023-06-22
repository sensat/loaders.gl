var utils = {
  URL: globalThis.URL || globalThis.webkitURL || globalThis.mozURL || globalThis.msURL,
  getUserMedia: function () {
    if (!globalThis.navigator) return globalThis.navigator;
    const getUserMedia = globalThis.navigator.getUserMedia || globalThis.navigator.webkitGetUserMedia || globalThis.navigator.mozGetUserMedia || globalThis.navigator.msGetUserMedia;
    return getUserMedia ? getUserMedia.bind(globalThis.navigator) : getUserMedia;
  }(),
  requestAnimFrame: globalThis.requestAnimationFrame || globalThis.webkitRequestAnimationFrame || globalThis.mozRequestAnimationFrame || globalThis.oRequestAnimationFrame || globalThis.msRequestAnimationFrame,
  requestTimeout: function requestTimeout(callback, delay) {
    callback = callback || utils.noop;
    delay = delay || 0;
    if (!utils.requestAnimFrame) {
      return setTimeout(callback, delay);
    }
    const start = new Date().getTime();
    const handle = new Object();
    const requestAnimFrame = utils.requestAnimFrame;
    const loop = function loop() {
      const current = new Date().getTime();
      const delta = current - start;
      delta >= delay ? callback.call() : handle.value = requestAnimFrame(loop);
    };
    handle.value = requestAnimFrame(loop);
    return handle;
  },
  Blob: globalThis.Blob || globalThis.BlobBuilder || globalThis.WebKitBlobBuilder || globalThis.MozBlobBuilder || globalThis.MSBlobBuilder,
  btoa: function () {
    const btoa = globalThis.btoa || function (input) {
      let output = '';
      let i = 0;
      const l = input.length;
      const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let chr1 = void 0;
      let chr2 = void 0;
      let chr3 = void 0;
      let enc1 = void 0;
      let enc2 = void 0;
      let enc3 = void 0;
      let enc4 = void 0;
      while (i < l) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = (chr1 & 3) << 4 | chr2 >> 4;
        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
      }
      return output;
    };
    return btoa ? btoa.bind(globalThis) : utils.noop;
  }(),
  isObject: function isObject(obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Object]';
  },
  isEmptyObject: function isEmptyObject(obj) {
    return utils.isObject(obj) && !Object.keys(obj).length;
  },
  isArray: function isArray(arr) {
    return arr && Array.isArray(arr);
  },
  isFunction: function isFunction(func) {
    return func && typeof func === 'function';
  },
  isElement: function isElement(elem) {
    return elem && elem.nodeType === 1;
  },
  isString: function isString(value) {
    return typeof value === 'string' || Object.prototype.toString.call(value) === '[object String]';
  },
  isSupported: {
    canvas: function canvas() {
      const el = document.createElement('canvas');
      return el && el.getContext && el.getContext('2d');
    },
    webworkers: function webworkers() {
      return globalThis.Worker;
    },
    blob: function blob() {
      return utils.Blob;
    },
    Uint8Array: function Uint8Array() {
      return globalThis.Uint8Array;
    },
    Uint32Array: function Uint32Array() {
      return globalThis.Uint32Array;
    },
    videoCodecs: function () {
      const testEl = document.createElement('video');
      const supportObj = {
        mp4: false,
        h264: false,
        ogv: false,
        ogg: false,
        webm: false
      };
      try {
        if (testEl && testEl.canPlayType) {
          supportObj.mp4 = testEl.canPlayType('video/mp4; codecs="mp4v.20.8"') !== '';
          supportObj.h264 = (testEl.canPlayType('video/mp4; codecs="avc1.42E01E"') || testEl.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) !== '';
          supportObj.ogv = testEl.canPlayType('video/ogg; codecs="theora"') !== '';
          supportObj.ogg = testEl.canPlayType('video/ogg; codecs="theora"') !== '';
          supportObj.webm = testEl.canPlayType('video/webm; codecs="vp8, vorbis"') !== -1;
        }
      } catch (e) {}
      return supportObj;
    }()
  },
  noop: function noop() {},
  each: function each(collection, callback) {
    let x = void 0;
    let len = void 0;
    if (utils.isArray(collection)) {
      x = -1;
      len = collection.length;
      while (++x < len) {
        if (callback(x, collection[x]) === false) {
          break;
        }
      }
    } else if (utils.isObject(collection)) {
      for (x in collection) {
        if (collection.hasOwnProperty(x)) {
          if (callback(x, collection[x]) === false) {
            break;
          }
        }
      }
    }
  },
  normalizeOptions: function normalizeOptions(defaultOptions, userOptions) {
    if (!utils.isObject(defaultOptions) || !utils.isObject(userOptions) || !Object.keys) {
      return;
    }
    const newObj = {};
    utils.each(defaultOptions, function (key, val) {
      newObj[key] = defaultOptions[key];
    });
    utils.each(userOptions, function (key, val) {
      const currentUserOption = userOptions[key];
      if (!utils.isObject(currentUserOption)) {
        newObj[key] = currentUserOption;
      } else if (!defaultOptions[key]) {
        newObj[key] = currentUserOption;
      } else {
        newObj[key] = utils.normalizeOptions(defaultOptions[key], currentUserOption);
      }
    });
    return newObj;
  },
  setCSSAttr: function setCSSAttr(elem, attr, val) {
    if (!utils.isElement(elem)) {
      return;
    }
    if (utils.isString(attr) && utils.isString(val)) {
      elem.style[attr] = val;
    } else if (utils.isObject(attr)) {
      utils.each(attr, function (key, val) {
        elem.style[key] = val;
      });
    }
  },
  removeElement: function removeElement(node) {
    if (!utils.isElement(node)) {
      return;
    }
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  },
  createWebWorker: function createWebWorker(content) {
    if (!utils.isString(content)) {
      return {};
    }
    try {
      const blob = new utils.Blob([content], {
        type: 'text/javascript'
      });
      const objectUrl = utils.URL.createObjectURL(blob);
      const worker = new Worker(objectUrl);
      return {
        objectUrl,
        worker
      };
    } catch (e) {
      return "".concat(e);
    }
  },
  getExtension: function getExtension(src) {
    return src.substr(src.lastIndexOf('.') + 1, src.length);
  },
  getFontSize: function getFontSize() {
    const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!document.body || options.resizeFont === false) {
      return options.fontSize;
    }
    const text = options.text;
    const containerWidth = options.gifWidth;
    let fontSize = parseInt(options.fontSize, 10);
    const minFontSize = parseInt(options.minFontSize, 10);
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.setAttribute('width', containerWidth);
    div.appendChild(span);
    span.innerHTML = text;
    span.style.fontSize = "".concat(fontSize, "px");
    span.style.textIndent = '-9999px';
    span.style.visibility = 'hidden';
    document.body.appendChild(span);
    while (span.offsetWidth > containerWidth && fontSize >= minFontSize) {
      span.style.fontSize = "".concat(--fontSize, "px");
    }
    document.body.removeChild(span);
    return "".concat(fontSize, "px");
  },
  webWorkerError: false
};
const utils$2 = Object.freeze({
  default: utils
});
var error = {
  validate: function validate(skipObj) {
    skipObj = utils.isObject(skipObj) ? skipObj : {};
    let errorObj = {};
    utils.each(error.validators, function (indece, currentValidator) {
      const errorCode = currentValidator.errorCode;
      if (!skipObj[errorCode] && !currentValidator.condition) {
        errorObj = currentValidator;
        errorObj.error = true;
        return false;
      }
    });
    delete errorObj.condition;
    return errorObj;
  },
  isValid: function isValid(skipObj) {
    const errorObj = error.validate(skipObj);
    const isValid = errorObj.error !== true;
    return isValid;
  },
  validators: [{
    condition: utils.isFunction(utils.getUserMedia),
    errorCode: 'getUserMedia',
    errorMsg: 'The getUserMedia API is not supported in your browser'
  }, {
    condition: utils.isSupported.canvas(),
    errorCode: 'canvas',
    errorMsg: 'Canvas elements are not supported in your browser'
  }, {
    condition: utils.isSupported.webworkers(),
    errorCode: 'webworkers',
    errorMsg: 'The Web Workers API is not supported in your browser'
  }, {
    condition: utils.isFunction(utils.URL),
    errorCode: 'globalThis.URL',
    errorMsg: 'The globalThis.URL API is not supported in your browser'
  }, {
    condition: utils.isSupported.blob(),
    errorCode: 'globalThis.Blob',
    errorMsg: 'The globalThis.Blob File API is not supported in your browser'
  }, {
    condition: utils.isSupported.Uint8Array(),
    errorCode: 'globalThis.Uint8Array',
    errorMsg: 'The globalThis.Uint8Array function constructor is not supported in your browser'
  }, {
    condition: utils.isSupported.Uint32Array(),
    errorCode: 'globalThis.Uint32Array',
    errorMsg: 'The globalThis.Uint32Array function constructor is not supported in your browser'
  }],
  messages: {
    videoCodecs: {
      errorCode: 'videocodec',
      errorMsg: 'The video codec you are trying to use is not supported in your browser'
    }
  }
};
const error$2 = Object.freeze({
  default: error
});
const noop = function noop() {};
const defaultOptions = {
  sampleInterval: 10,
  numWorkers: 2,
  filter: '',
  gifWidth: 200,
  gifHeight: 200,
  interval: 0.1,
  numFrames: 10,
  frameDuration: 1,
  keepCameraOn: false,
  images: [],
  video: null,
  webcamVideoElement: null,
  cameraStream: null,
  text: '',
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
  progressCallback: noop,
  completeCallback: noop,
  saveRenderingContexts: false,
  savedRenderingContexts: [],
  crossOrigin: 'Anonymous'
};
const defaultOptions$2 = Object.freeze({
  default: defaultOptions
});
function isSupported() {
  return error.isValid();
}
function isWebCamGIFSupported() {
  return error.isValid();
}
function isSupported$1() {
  const options = {
    getUserMedia: true
  };
  return error.isValid(options);
}
function isExistingVideoGIFSupported(codecs) {
  let hasValidCodec = false;
  if (utils.isArray(codecs) && codecs.length) {
    utils.each(codecs, function (indece, currentCodec) {
      if (utils.isSupported.videoCodecs[currentCodec]) {
        hasValidCodec = true;
      }
    });
    if (!hasValidCodec) {
      return false;
    }
  } else if (utils.isString(codecs) && codecs.length) {
    if (!utils.isSupported.videoCodecs[codecs]) {
      return false;
    }
  }
  return error.isValid({
    getUserMedia: true
  });
}
function NeuQuant() {
  const netsize = 256;
  const prime1 = 499;
  const prime2 = 491;
  const prime3 = 487;
  const prime4 = 503;
  const minpicturebytes = 3 * prime4;
  const maxnetpos = netsize - 1;
  const netbiasshift = 4;
  const ncycles = 100;
  const intbiasshift = 16;
  const intbias = 1 << intbiasshift;
  const gammashift = 10;
  const gamma = 1 << gammashift;
  const betashift = 10;
  const beta = intbias >> betashift;
  const betagamma = intbias << gammashift - betashift;
  const initrad = netsize >> 3;
  const radiusbiasshift = 6;
  const radiusbias = 1 << radiusbiasshift;
  const initradius = initrad * radiusbias;
  const radiusdec = 30;
  const alphabiasshift = 10;
  const initalpha = 1 << alphabiasshift;
  let alphadec;
  const radbiasshift = 8;
  const radbias = 1 << radbiasshift;
  const alpharadbshift = alphabiasshift + radbiasshift;
  const alpharadbias = 1 << alpharadbshift;
  let thepicture;
  let lengthcount;
  let samplefac;
  let network;
  const netindex = [];
  const bias = [];
  const freq = [];
  const radpower = [];
  function NeuQuantConstructor(thepic, len, sample) {
    let i;
    let p;
    thepicture = thepic;
    lengthcount = len;
    samplefac = sample;
    network = new Array(netsize);
    for (i = 0; i < netsize; i++) {
      network[i] = new Array(4);
      p = network[i];
      p[0] = p[1] = p[2] = (i << netbiasshift + 8) / netsize | 0;
      freq[i] = intbias / netsize | 0;
      bias[i] = 0;
    }
  }
  function colorMap() {
    const map = [];
    const index = new Array(netsize);
    for (let i = 0; i < netsize; i++) {
      index[network[i][3]] = i;
    }
    let k = 0;
    for (let l = 0; l < netsize; l++) {
      const j = index[l];
      map[k++] = network[j][0];
      map[k++] = network[j][1];
      map[k++] = network[j][2];
    }
    return map;
  }
  function inxbuild() {
    let i;
    let j;
    let smallpos;
    let smallval;
    let p;
    let q;
    let previouscol;
    let startpos;
    previouscol = 0;
    startpos = 0;
    for (i = 0; i < netsize; i++) {
      p = network[i];
      smallpos = i;
      smallval = p[1];
      for (j = i + 1; j < netsize; j++) {
        q = network[j];
        if (q[1] < smallval) {
          smallpos = j;
          smallval = q[1];
        }
      }
      q = network[smallpos];
      if (i != smallpos) {
        j = q[0];
        q[0] = p[0];
        p[0] = j;
        j = q[1];
        q[1] = p[1];
        p[1] = j;
        j = q[2];
        q[2] = p[2];
        p[2] = j;
        j = q[3];
        q[3] = p[3];
        p[3] = j;
      }
      if (smallval != previouscol) {
        netindex[previouscol] = startpos + i >> 1;
        for (j = previouscol + 1; j < smallval; j++) {
          netindex[j] = i;
        }
        previouscol = smallval;
        startpos = i;
      }
    }
    netindex[previouscol] = startpos + maxnetpos >> 1;
    for (j = previouscol + 1; j < 256; j++) {
      netindex[j] = maxnetpos;
    }
  }
  function learn() {
    let i;
    let j;
    let b;
    let g;
    let r;
    let radius;
    let rad;
    let alpha;
    let step;
    let delta;
    let samplepixels;
    let p;
    let pix;
    let lim;
    if (lengthcount < minpicturebytes) {
      samplefac = 1;
    }
    alphadec = 30 + (samplefac - 1) / 3;
    p = thepicture;
    pix = 0;
    lim = lengthcount;
    samplepixels = lengthcount / (3 * samplefac);
    delta = samplepixels / ncycles | 0;
    alpha = initalpha;
    radius = initradius;
    rad = radius >> radiusbiasshift;
    if (rad <= 1) {
      rad = 0;
    }
    for (i = 0; i < rad; i++) {
      radpower[i] = alpha * ((rad * rad - i * i) * radbias / (rad * rad));
    }
    if (lengthcount < minpicturebytes) {
      step = 3;
    } else if (lengthcount % prime1 !== 0) {
      step = 3 * prime1;
    } else if (lengthcount % prime2 !== 0) {
      step = 3 * prime2;
    } else if (lengthcount % prime3 !== 0) {
      step = 3 * prime3;
    } else {
      step = 3 * prime4;
    }
    i = 0;
    while (i < samplepixels) {
      b = (p[pix + 0] & 0xff) << netbiasshift;
      g = (p[pix + 1] & 0xff) << netbiasshift;
      r = (p[pix + 2] & 0xff) << netbiasshift;
      j = contest(b, g, r);
      altersingle(alpha, j, b, g, r);
      if (rad !== 0) {
        alterneigh(rad, j, b, g, r);
      }
      pix += step;
      if (pix >= lim) {
        pix -= lengthcount;
      }
      i++;
      if (delta === 0) {
        delta = 1;
      }
      if (i % delta === 0) {
        alpha -= alpha / alphadec;
        radius -= radius / radiusdec;
        rad = radius >> radiusbiasshift;
        if (rad <= 1) {
          rad = 0;
        }
        for (j = 0; j < rad; j++) {
          radpower[j] = alpha * ((rad * rad - j * j) * radbias / (rad * rad));
        }
      }
    }
  }
  function map(b, g, r) {
    let i;
    let j;
    let dist;
    let a;
    let bestd;
    let p;
    let best;
    bestd = 1000;
    best = -1;
    i = netindex[g];
    j = i - 1;
    while (i < netsize || j >= 0) {
      if (i < netsize) {
        p = network[i];
        dist = p[1] - g;
        if (dist >= bestd) {
          i = netsize;
        } else {
          i++;
          if (dist < 0) {
            dist = -dist;
          }
          a = p[0] - b;
          if (a < 0) {
            a = -a;
          }
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) {
              a = -a;
            }
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
      if (j >= 0) {
        p = network[j];
        dist = g - p[1];
        if (dist >= bestd) {
          j = -1;
        } else {
          j--;
          if (dist < 0) {
            dist = -dist;
          }
          a = p[0] - b;
          if (a < 0) {
            a = -a;
          }
          dist += a;
          if (dist < bestd) {
            a = p[2] - r;
            if (a < 0) {
              a = -a;
            }
            dist += a;
            if (dist < bestd) {
              bestd = dist;
              best = p[3];
            }
          }
        }
      }
    }
    return best;
  }
  function process() {
    learn();
    unbiasnet();
    inxbuild();
    return colorMap();
  }
  function unbiasnet() {
    let i;
    let j;
    for (i = 0; i < netsize; i++) {
      network[i][0] >>= netbiasshift;
      network[i][1] >>= netbiasshift;
      network[i][2] >>= netbiasshift;
      network[i][3] = i;
    }
  }
  function alterneigh(rad, i, b, g, r) {
    let j;
    let k;
    let lo;
    let hi;
    let a;
    let m;
    let p;
    lo = i - rad;
    if (lo < -1) {
      lo = -1;
    }
    hi = i + rad;
    if (hi > netsize) {
      hi = netsize;
    }
    j = i + 1;
    k = i - 1;
    m = 1;
    while (j < hi || k > lo) {
      a = radpower[m++];
      if (j < hi) {
        p = network[j++];
        try {
          p[0] -= a * (p[0] - b) / alpharadbias | 0;
          p[1] -= a * (p[1] - g) / alpharadbias | 0;
          p[2] -= a * (p[2] - r) / alpharadbias | 0;
        } catch (e) {}
      }
      if (k > lo) {
        p = network[k--];
        try {
          p[0] -= a * (p[0] - b) / alpharadbias | 0;
          p[1] -= a * (p[1] - g) / alpharadbias | 0;
          p[2] -= a * (p[2] - r) / alpharadbias | 0;
        } catch (e) {}
      }
    }
  }
  function altersingle(alpha, i, b, g, r) {
    const n = network[i];
    const alphaMult = alpha / initalpha;
    n[0] -= alphaMult * (n[0] - b) | 0;
    n[1] -= alphaMult * (n[1] - g) | 0;
    n[2] -= alphaMult * (n[2] - r) | 0;
  }
  function contest(b, g, r) {
    let i;
    let dist;
    let a;
    let biasdist;
    let betafreq;
    let bestpos;
    let bestbiaspos;
    let bestd;
    let bestbiasd;
    let n;
    bestd = ~(1 << 31);
    bestbiasd = bestd;
    bestpos = -1;
    bestbiaspos = bestpos;
    for (i = 0; i < netsize; i++) {
      n = network[i];
      dist = n[0] - b;
      if (dist < 0) {
        dist = -dist;
      }
      a = n[1] - g;
      if (a < 0) {
        a = -a;
      }
      dist += a;
      a = n[2] - r;
      if (a < 0) {
        a = -a;
      }
      dist += a;
      if (dist < bestd) {
        bestd = dist;
        bestpos = i;
      }
      biasdist = dist - (bias[i] >> intbiasshift - netbiasshift);
      if (biasdist < bestbiasd) {
        bestbiasd = biasdist;
        bestbiaspos = i;
      }
      betafreq = freq[i] >> betashift;
      freq[i] -= betafreq;
      bias[i] += betafreq << gammashift;
    }
    freq[bestpos] += beta;
    bias[bestpos] -= betagamma;
    return bestbiaspos;
  }
  NeuQuantConstructor.apply(this, arguments);
  const exports = {};
  exports.map = map;
  exports.process = process;
  return exports;
}
function workerCode() {
  const self = this;
  try {
    globalThis.onmessage = function (ev) {
      const data = ev.data || {};
      let response;
      if (data.gifshot) {
        response = workerMethods.run(data);
        postMessage(response);
      }
    };
  } catch (e) {}
  var workerMethods = {
    dataToRGB: function dataToRGB(data, width, height) {
      const length = width * height * 4;
      let i = 0;
      const rgb = [];
      while (i < length) {
        rgb.push(data[i++]);
        rgb.push(data[i++]);
        rgb.push(data[i++]);
        i++;
      }
      return rgb;
    },
    componentizedPaletteToArray: function componentizedPaletteToArray(paletteRGB) {
      paletteRGB = paletteRGB || [];
      const paletteArray = [];
      for (let i = 0; i < paletteRGB.length; i += 3) {
        const r = paletteRGB[i];
        const g = paletteRGB[i + 1];
        const b = paletteRGB[i + 2];
        paletteArray.push(r << 16 | g << 8 | b);
      }
      return paletteArray;
    },
    processFrameWithQuantizer: function processFrameWithQuantizer(imageData, width, height, sampleInterval) {
      const rgbComponents = this.dataToRGB(imageData, width, height);
      const nq = new NeuQuant(rgbComponents, rgbComponents.length, sampleInterval);
      const paletteRGB = nq.process();
      const paletteArray = new Uint32Array(this.componentizedPaletteToArray(paletteRGB));
      const numberPixels = width * height;
      const indexedPixels = new Uint8Array(numberPixels);
      let k = 0;
      for (let i = 0; i < numberPixels; i++) {
        const r = rgbComponents[k++];
        const g = rgbComponents[k++];
        const b = rgbComponents[k++];
        indexedPixels[i] = nq.map(r, g, b);
      }
      return {
        pixels: indexedPixels,
        palette: paletteArray
      };
    },
    run: function run(frame) {
      frame = frame || {};
      const _frame = frame;
      const height = _frame.height;
      const palette = _frame.palette;
      const sampleInterval = _frame.sampleInterval;
      const width = _frame.width;
      const imageData = frame.data;
      return this.processFrameWithQuantizer(imageData, width, height, sampleInterval);
    }
  };
  return workerMethods;
}
function gifWriter(buf, width, height, gopts) {
  let p = 0;
  gopts = gopts === undefined ? {} : gopts;
  const loop_count = gopts.loop === undefined ? null : gopts.loop;
  const global_palette = gopts.palette === undefined ? null : gopts.palette;
  if (width <= 0 || height <= 0 || width > 65535 || height > 65535) throw 'Width/Height invalid.';
  function check_palette_and_num_colors(palette) {
    const num_colors = palette.length;
    if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1) throw 'Invalid code/color length, must be power of 2 and 2 .. 256.';
    return num_colors;
  }
  buf[p++] = 0x47;
  buf[p++] = 0x49;
  buf[p++] = 0x46;
  buf[p++] = 0x38;
  buf[p++] = 0x39;
  buf[p++] = 0x61;
  const gp_num_colors_pow2 = 0;
  const background = 0;
  buf[p++] = width & 0xff;
  buf[p++] = width >> 8 & 0xff;
  buf[p++] = height & 0xff;
  buf[p++] = height >> 8 & 0xff;
  buf[p++] = (global_palette !== null ? 0x80 : 0) | gp_num_colors_pow2;
  buf[p++] = background;
  buf[p++] = 0;
  if (loop_count !== null) {
    if (loop_count < 0 || loop_count > 65535) throw 'Loop count invalid.';
    buf[p++] = 0x21;
    buf[p++] = 0xff;
    buf[p++] = 0x0b;
    buf[p++] = 0x4e;
    buf[p++] = 0x45;
    buf[p++] = 0x54;
    buf[p++] = 0x53;
    buf[p++] = 0x43;
    buf[p++] = 0x41;
    buf[p++] = 0x50;
    buf[p++] = 0x45;
    buf[p++] = 0x32;
    buf[p++] = 0x2e;
    buf[p++] = 0x30;
    buf[p++] = 0x03;
    buf[p++] = 0x01;
    buf[p++] = loop_count & 0xff;
    buf[p++] = loop_count >> 8 & 0xff;
    buf[p++] = 0x00;
  }
  let ended = false;
  this.addFrame = function (x, y, w, h, indexed_pixels, opts) {
    if (ended === true) {
      --p;
      ended = false;
    }
    opts = opts === undefined ? {} : opts;
    if (x < 0 || y < 0 || x > 65535 || y > 65535) throw 'x/y invalid.';
    if (w <= 0 || h <= 0 || w > 65535 || h > 65535) throw 'Width/Height invalid.';
    if (indexed_pixels.length < w * h) throw 'Not enough pixels for the frame size.';
    let using_local_palette = true;
    let palette = opts.palette;
    if (palette === undefined || palette === null) {
      using_local_palette = false;
      palette = global_palette;
    }
    if (palette === undefined || palette === null) throw 'Must supply either a local or global palette.';
    let num_colors = check_palette_and_num_colors(palette);
    let min_code_size = 0;
    while (num_colors >>= 1) {
      ++min_code_size;
    }
    num_colors = 1 << min_code_size;
    const delay = opts.delay === undefined ? 0 : opts.delay;
    const disposal = opts.disposal === undefined ? 0 : opts.disposal;
    if (disposal < 0 || disposal > 3) throw 'Disposal out of range.';
    let use_transparency = false;
    let transparent_index = 0;
    if (opts.transparent !== undefined && opts.transparent !== null) {
      use_transparency = true;
      transparent_index = opts.transparent;
      if (transparent_index < 0 || transparent_index >= num_colors) throw 'Transparent color index.';
    }
    if (disposal !== 0 || use_transparency || delay !== 0) {
      buf[p++] = 0x21;
      buf[p++] = 0xf9;
      buf[p++] = 4;
      buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);
      buf[p++] = delay & 0xff;
      buf[p++] = delay >> 8 & 0xff;
      buf[p++] = transparent_index;
      buf[p++] = 0;
    }
    buf[p++] = 0x2c;
    buf[p++] = x & 0xff;
    buf[p++] = x >> 8 & 0xff;
    buf[p++] = y & 0xff;
    buf[p++] = y >> 8 & 0xff;
    buf[p++] = w & 0xff;
    buf[p++] = w >> 8 & 0xff;
    buf[p++] = h & 0xff;
    buf[p++] = h >> 8 & 0xff;
    buf[p++] = using_local_palette === true ? 0x80 | min_code_size - 1 : 0;
    if (using_local_palette === true) {
      for (let i = 0, il = palette.length; i < il; ++i) {
        const rgb = palette[i];
        buf[p++] = rgb >> 16 & 0xff;
        buf[p++] = rgb >> 8 & 0xff;
        buf[p++] = rgb & 0xff;
      }
    }
    p = GifWriterOutputLZWCodeStream(buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);
  };
  this.end = function () {
    if (ended === false) {
      buf[p++] = 0x3b;
      ended = true;
    }
    return p;
  };
  function GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {
    buf[p++] = min_code_size;
    let cur_subblock = p++;
    const clear_code = 1 << min_code_size;
    const code_mask = clear_code - 1;
    const eoi_code = clear_code + 1;
    let next_code = eoi_code + 1;
    let cur_code_size = min_code_size + 1;
    let cur_shift = 0;
    let cur = 0;
    function emit_bytes_to_buffer(bit_block_size) {
      while (cur_shift >= bit_block_size) {
        buf[p++] = cur & 0xff;
        cur >>= 8;
        cur_shift -= 8;
        if (p === cur_subblock + 256) {
          buf[cur_subblock] = 255;
          cur_subblock = p++;
        }
      }
    }
    function emit_code(c) {
      cur |= c << cur_shift;
      cur_shift += cur_code_size;
      emit_bytes_to_buffer(8);
    }
    let ib_code = index_stream[0] & code_mask;
    let code_table = {};
    emit_code(clear_code);
    for (let i = 1, il = index_stream.length; i < il; ++i) {
      const k = index_stream[i] & code_mask;
      const cur_key = ib_code << 8 | k;
      const cur_code = code_table[cur_key];
      if (cur_code === undefined) {
        cur |= ib_code << cur_shift;
        cur_shift += cur_code_size;
        while (cur_shift >= 8) {
          buf[p++] = cur & 0xff;
          cur >>= 8;
          cur_shift -= 8;
          if (p === cur_subblock + 256) {
            buf[cur_subblock] = 255;
            cur_subblock = p++;
          }
        }
        if (next_code === 4096) {
          emit_code(clear_code);
          next_code = eoi_code + 1;
          cur_code_size = min_code_size + 1;
          code_table = {};
        } else {
          if (next_code >= 1 << cur_code_size) ++cur_code_size;
          code_table[cur_key] = next_code++;
        }
        ib_code = k;
      } else {
        ib_code = cur_code;
      }
    }
    emit_code(ib_code);
    emit_code(eoi_code);
    emit_bytes_to_buffer(1);
    if (cur_subblock + 1 === p) {
      buf[cur_subblock] = 0;
    } else {
      buf[cur_subblock] = p - cur_subblock - 1;
      buf[p++] = 0;
    }
    return p;
  }
}
const noop$2 = function noop() {};
const AnimatedGIF = function AnimatedGIF(options) {
  this.canvas = null;
  this.ctx = null;
  this.repeat = 0;
  this.frames = [];
  this.numRenderedFrames = 0;
  this.onRenderCompleteCallback = noop$2;
  this.onRenderProgressCallback = noop$2;
  this.workers = [];
  this.availableWorkers = [];
  this.generatingGIF = false;
  this.options = options;
  this.initializeWebWorkers(options);
};
AnimatedGIF.prototype = {
  workerMethods: workerCode(),
  initializeWebWorkers: function initializeWebWorkers(options) {
    const self = this;
    const processFrameWorkerCode = "".concat(NeuQuant.toString(), "(").concat(workerCode.toString(), "());");
    let webWorkerObj = void 0;
    let objectUrl = void 0;
    let webWorker = void 0;
    let numWorkers = void 0;
    let x = -1;
    let workerError = '';
    numWorkers = options.numWorkers;
    while (++x < numWorkers) {
      webWorkerObj = utils.createWebWorker(processFrameWorkerCode);
      if (utils.isObject(webWorkerObj)) {
        objectUrl = webWorkerObj.objectUrl;
        webWorker = webWorkerObj.worker;
        self.workers.push({
          worker: webWorker,
          objectUrl
        });
        self.availableWorkers.push(webWorker);
      } else {
        workerError = webWorkerObj;
        utils.webWorkerError = Boolean(webWorkerObj);
      }
    }
    this.workerError = workerError;
    this.canvas = document.createElement('canvas');
    this.canvas.width = options.gifWidth;
    this.canvas.height = options.gifHeight;
    this.ctx = this.canvas.getContext('2d');
    this.frames = [];
  },
  getWorker: function getWorker() {
    return this.availableWorkers.pop();
  },
  freeWorker: function freeWorker(worker) {
    this.availableWorkers.push(worker);
  },
  byteMap: function () {
    const byteMap = [];
    for (let i = 0; i < 256; i++) {
      byteMap[i] = String.fromCharCode(i);
    }
    return byteMap;
  }(),
  bufferToString: function bufferToString(buffer) {
    const numberValues = buffer.length;
    let str = '';
    let x = -1;
    while (++x < numberValues) {
      str += this.byteMap[buffer[x]];
    }
    return str;
  },
  onFrameFinished: function onFrameFinished(progressCallback) {
    const self = this;
    const frames = self.frames;
    const options = self.options;
    const hasExistingImages = Boolean((options.images || []).length);
    const allDone = frames.every(function (frame) {
      return !frame.beingProcessed && frame.done;
    });
    self.numRenderedFrames++;
    if (hasExistingImages) {
      progressCallback(self.numRenderedFrames / frames.length);
    }
    self.onRenderProgressCallback(self.numRenderedFrames * 0.75 / frames.length);
    if (allDone) {
      if (!self.generatingGIF) {
        self.generateGIF(frames, self.onRenderCompleteCallback);
      }
    } else {
      utils.requestTimeout(function () {
        self.processNextFrame();
      }, 1);
    }
  },
  processFrame: function processFrame(position) {
    const AnimatedGifContext = this;
    const options = this.options;
    const _options = this.options;
    const progressCallback = _options.progressCallback;
    const sampleInterval = _options.sampleInterval;
    const frames = this.frames;
    let frame = void 0;
    let worker = void 0;
    const done = function done() {
      const ev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const data = ev.data;
      delete frame.data;
      frame.pixels = Array.prototype.slice.call(data.pixels);
      frame.palette = Array.prototype.slice.call(data.palette);
      frame.done = true;
      frame.beingProcessed = false;
      AnimatedGifContext.freeWorker(worker);
      AnimatedGifContext.onFrameFinished(progressCallback);
    };
    frame = frames[position];
    if (frame.beingProcessed || frame.done) {
      this.onFrameFinished();
      return;
    }
    frame.sampleInterval = sampleInterval;
    frame.beingProcessed = true;
    frame.gifshot = true;
    worker = this.getWorker();
    if (worker) {
      worker.onmessage = done;
      worker.postMessage(frame);
    } else {
      done({
        data: AnimatedGifContext.workerMethods.run(frame)
      });
    }
  },
  startRendering: function startRendering(completeCallback) {
    this.onRenderCompleteCallback = completeCallback;
    for (let i = 0; i < this.options.numWorkers && i < this.frames.length; i++) {
      this.processFrame(i);
    }
  },
  processNextFrame: function processNextFrame() {
    let position = -1;
    for (let i = 0; i < this.frames.length; i++) {
      const frame = this.frames[i];
      if (!frame.done && !frame.beingProcessed) {
        position = i;
        break;
      }
    }
    if (position >= 0) {
      this.processFrame(position);
    }
  },
  generateGIF: function generateGIF(frames, callback) {
    const buffer = [];
    const gifOptions = {
      loop: this.repeat
    };
    const options = this.options;
    const interval = options.interval;
    const frameDuration = options.frameDuration;
    const existingImages = options.images;
    const hasExistingImages = Boolean(existingImages.length);
    const height = options.gifHeight;
    const width = options.gifWidth;
    const gifWriter$$1 = new gifWriter(buffer, width, height, gifOptions);
    const onRenderProgressCallback = this.onRenderProgressCallback;
    const delay = hasExistingImages ? interval * 100 : 0;
    let bufferToString = void 0;
    let gif = void 0;
    this.generatingGIF = true;
    utils.each(frames, function (iterator, frame) {
      const framePalette = frame.palette;
      onRenderProgressCallback(0.75 + 0.25 * frame.position * 1.0 / frames.length);
      for (let i = 0; i < frameDuration; i++) {
        gifWriter$$1.addFrame(0, 0, width, height, frame.pixels, {
          palette: framePalette,
          delay
        });
      }
    });
    gifWriter$$1.end();
    onRenderProgressCallback(1.0);
    this.frames = [];
    this.generatingGIF = false;
    if (utils.isFunction(callback)) {
      bufferToString = this.bufferToString(buffer);
      gif = "data:image/gif;base64,".concat(utils.btoa(bufferToString));
      callback(gif);
    }
  },
  setRepeat: function setRepeat(r) {
    this.repeat = r;
  },
  addFrame: function addFrame(element, gifshotOptions) {
    gifshotOptions = utils.isObject(gifshotOptions) ? gifshotOptions : {};
    const self = this;
    const ctx = self.ctx;
    const options = self.options;
    const width = options.gifWidth;
    const height = options.gifHeight;
    const fontSize = utils.getFontSize(gifshotOptions);
    const _gifshotOptions = gifshotOptions;
    const filter = _gifshotOptions.filter;
    const fontColor = _gifshotOptions.fontColor;
    const fontFamily = _gifshotOptions.fontFamily;
    const fontWeight = _gifshotOptions.fontWeight;
    const gifHeight = _gifshotOptions.gifHeight;
    const gifWidth = _gifshotOptions.gifWidth;
    const text = _gifshotOptions.text;
    const textAlign = _gifshotOptions.textAlign;
    const textBaseline = _gifshotOptions.textBaseline;
    const textXCoordinate = gifshotOptions.textXCoordinate ? gifshotOptions.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? width : width / 2;
    const textYCoordinate = gifshotOptions.textYCoordinate ? gifshotOptions.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? height / 2 : height;
    const font = "".concat(fontWeight, " ").concat(fontSize, " ").concat(fontFamily);
    let imageData = void 0;
    try {
      ctx.filter = filter;
      ctx.drawImage(element, 0, 0, width, height);
      if (text) {
        ctx.font = font;
        ctx.fillStyle = fontColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillText(text, textXCoordinate, textYCoordinate);
      }
      imageData = ctx.getImageData(0, 0, width, height);
      self.addFrameImageData(imageData);
    } catch (e) {
      return "".concat(e);
    }
  },
  addFrameImageData: function addFrameImageData() {
    const imageData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const frames = this.frames;
    const imageDataArray = imageData.data;
    this.frames.push({
      data: imageDataArray,
      width: imageData.width,
      height: imageData.height,
      palette: null,
      dithering: null,
      done: false,
      beingProcessed: false,
      position: frames.length
    });
  },
  onRenderProgress: function onRenderProgress(callback) {
    this.onRenderProgressCallback = callback;
  },
  isRendering: function isRendering() {
    return this.generatingGIF;
  },
  getBase64GIF: function getBase64GIF(completeCallback) {
    const self = this;
    const onRenderComplete = function onRenderComplete(gif) {
      self.destroyWorkers();
      utils.requestTimeout(function () {
        completeCallback(gif);
      }, 0);
    };
    self.startRendering(onRenderComplete);
  },
  destroyWorkers: function destroyWorkers() {
    if (this.workerError) {
      return;
    }
    const workers = this.workers;
    utils.each(workers, function (iterator, workerObj) {
      const worker = workerObj.worker;
      const objectUrl = workerObj.objectUrl;
      worker.terminate();
      utils.URL.revokeObjectURL(objectUrl);
    });
  }
};
function getBase64GIF(animatedGifInstance, callback) {
  animatedGifInstance.getBase64GIF(function (image) {
    callback({
      error: false,
      errorCode: '',
      errorMsg: '',
      image
    });
  });
}
function existingImages() {
  const obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const self = this;
  const callback = obj.callback;
  const images = obj.images;
  const options = obj.options;
  let imagesLength = obj.imagesLength;
  const skipObj = {
    getUserMedia: true,
    'globalThis.URL': true
  };
  const errorObj = error.validate(skipObj);
  const loadedImages = [];
  let loadedImagesLength = 0;
  let tempImage = void 0;
  let ag = void 0;
  if (errorObj.error) {
    return callback(errorObj);
  }
  ag = new AnimatedGIF(options);
  utils.each(images, function (index, image) {
    const currentImage = image;
    if (utils.isElement(currentImage)) {
      if (options.crossOrigin) {
        currentImage.crossOrigin = options.crossOrigin;
      }
      loadedImages[index] = currentImage;
      loadedImagesLength += 1;
      if (loadedImagesLength === imagesLength) {
        addLoadedImagesToGif();
      }
    } else if (utils.isString(currentImage)) {
      tempImage = new Image();
      if (options.crossOrigin) {
        tempImage.crossOrigin = options.crossOrigin;
      }
      (function (tempImage) {
        if (image.text) {
          tempImage.text = image.text;
        }
        tempImage.onerror = function (e) {
          let obj = void 0;
          --imagesLength;
          if (imagesLength === 0) {
            obj = {};
            obj.error = 'None of the requested images was capable of being retrieved';
            return callback(obj);
          }
        };
        tempImage.onload = function (e) {
          if (image.text) {
            loadedImages[index] = {
              img: tempImage,
              text: tempImage.text
            };
          } else {
            loadedImages[index] = tempImage;
          }
          loadedImagesLength += 1;
          if (loadedImagesLength === imagesLength) {
            addLoadedImagesToGif();
          }
          utils.removeElement(tempImage);
        };
        tempImage.src = currentImage;
      })(tempImage);
      utils.setCSSAttr(tempImage, {
        position: 'fixed',
        opacity: '0'
      });
      document.body.appendChild(tempImage);
    }
  });
  function addLoadedImagesToGif() {
    utils.each(loadedImages, function (index, loadedImage) {
      if (loadedImage) {
        if (loadedImage.text) {
          ag.addFrame(loadedImage.img, options, loadedImage.text);
        } else {
          ag.addFrame(loadedImage, options);
        }
      }
    });
    getBase64GIF(ag, callback);
  }
}
const noop$3 = function noop() {};
const screenShot = {
  getGIF: function getGIF() {
    const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let callback = arguments[1];
    callback = utils.isFunction(callback) ? callback : noop$3;
    const canvas = document.createElement('canvas');
    let context = void 0;
    const existingImages = options.images;
    const hasExistingImages = Boolean(existingImages.length);
    const cameraStream = options.cameraStream;
    const crop = options.crop;
    const filter = options.filter;
    const fontColor = options.fontColor;
    const fontFamily = options.fontFamily;
    const fontWeight = options.fontWeight;
    const keepCameraOn = options.keepCameraOn;
    const numWorkers = options.numWorkers;
    const progressCallback = options.progressCallback;
    const saveRenderingContexts = options.saveRenderingContexts;
    const savedRenderingContexts = options.savedRenderingContexts;
    const text = options.text;
    const textAlign = options.textAlign;
    const textBaseline = options.textBaseline;
    const videoElement = options.videoElement;
    const videoHeight = options.videoHeight;
    const videoWidth = options.videoWidth;
    const webcamVideoElement = options.webcamVideoElement;
    const gifWidth = Number(options.gifWidth);
    const gifHeight = Number(options.gifHeight);
    let interval = Number(options.interval);
    const sampleInterval = Number(options.sampleInterval);
    const waitBetweenFrames = hasExistingImages ? 0 : interval * 1000;
    const renderingContextsToSave = [];
    let numFrames = savedRenderingContexts.length ? savedRenderingContexts.length : options.numFrames;
    let pendingFrames = numFrames;
    const ag = new AnimatedGIF(options);
    const fontSize = utils.getFontSize(options);
    const textXCoordinate = options.textXCoordinate ? options.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? gifWidth : gifWidth / 2;
    const textYCoordinate = options.textYCoordinate ? options.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? gifHeight / 2 : gifHeight;
    const font = "".concat(fontWeight, " ").concat(fontSize, " ").concat(fontFamily);
    let sourceX = crop ? Math.floor(crop.scaledWidth / 2) : 0;
    let sourceWidth = crop ? videoWidth - crop.scaledWidth : 0;
    let sourceY = crop ? Math.floor(crop.scaledHeight / 2) : 0;
    let sourceHeight = crop ? videoHeight - crop.scaledHeight : 0;
    const captureFrames = function captureSingleFrame() {
      const framesLeft = pendingFrames - 1;
      if (savedRenderingContexts.length) {
        context.putImageData(savedRenderingContexts[numFrames - pendingFrames], 0, 0);
        finishCapture();
      } else {
        drawVideo();
      }
      function drawVideo() {
        try {
          if (sourceWidth > videoWidth) {
            sourceWidth = videoWidth;
          }
          if (sourceHeight > videoHeight) {
            sourceHeight = videoHeight;
          }
          if (sourceX < 0) {
            sourceX = 0;
          }
          if (sourceY < 0) {
            sourceY = 0;
          }
          context.filter = filter;
          context.drawImage(videoElement, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, gifWidth, gifHeight);
          finishCapture();
        } catch (e) {
          if (e.name === 'NS_ERROR_NOT_AVAILABLE') {
            utils.requestTimeout(drawVideo, 100);
          } else {
            throw e;
          }
        }
      }
      function finishCapture() {
        let imageData = void 0;
        if (saveRenderingContexts) {
          renderingContextsToSave.push(context.getImageData(0, 0, gifWidth, gifHeight));
        }
        if (text) {
          context.font = font;
          context.fillStyle = fontColor;
          context.textAlign = textAlign;
          context.textBaseline = textBaseline;
          context.fillText(text, textXCoordinate, textYCoordinate);
        }
        imageData = context.getImageData(0, 0, gifWidth, gifHeight);
        ag.addFrameImageData(imageData);
        pendingFrames = framesLeft;
        progressCallback((numFrames - pendingFrames) / numFrames);
        if (framesLeft > 0) {
          utils.requestTimeout(captureSingleFrame, waitBetweenFrames);
        }
        if (!pendingFrames) {
          ag.getBase64GIF(function (image) {
            callback({
              error: false,
              errorCode: '',
              errorMsg: '',
              image,
              cameraStream,
              videoElement,
              webcamVideoElement,
              savedRenderingContexts: renderingContextsToSave,
              keepCameraOn
            });
          });
        }
      }
    };
    numFrames = numFrames !== undefined ? numFrames : 10;
    interval = interval !== undefined ? interval : 0.1;
    canvas.width = gifWidth;
    canvas.height = gifHeight;
    context = canvas.getContext('2d');
    (function capture() {
      if (!savedRenderingContexts.length && videoElement.currentTime === 0) {
        utils.requestTimeout(capture, 100);
        return;
      }
      captureFrames();
    })();
  },
  getCropDimensions: function getCropDimensions() {
    const obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const width = obj.videoWidth;
    const height = obj.videoHeight;
    const gifWidth = obj.gifWidth;
    const gifHeight = obj.gifHeight;
    const result = {
      width: 0,
      height: 0,
      scaledWidth: 0,
      scaledHeight: 0
    };
    if (width > height) {
      result.width = Math.round(width * (gifHeight / height)) - gifWidth;
      result.scaledWidth = Math.round(result.width * (height / gifHeight));
    } else {
      result.height = Math.round(height * (gifWidth / width)) - gifHeight;
      result.scaledHeight = Math.round(result.height * (width / gifWidth));
    }
    return result;
  }
};
var videoStream = {
  loadedData: false,
  defaultVideoDimensions: {
    width: 640,
    height: 480
  },
  findVideoSize: function findVideoSizeMethod(obj) {
    findVideoSizeMethod.attempts = findVideoSizeMethod.attempts || 0;
    const cameraStream = obj.cameraStream;
    const completedCallback = obj.completedCallback;
    const videoElement = obj.videoElement;
    if (!videoElement) {
      return;
    }
    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
      videoElement.removeEventListener('loadeddata', videoStream.findVideoSize);
      completedCallback({
        videoElement,
        cameraStream,
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight
      });
    } else if (findVideoSizeMethod.attempts < 10) {
      findVideoSizeMethod.attempts += 1;
      utils.requestTimeout(function () {
        videoStream.findVideoSize(obj);
      }, 400);
    } else {
      completedCallback({
        videoElement,
        cameraStream,
        videoWidth: videoStream.defaultVideoDimensions.width,
        videoHeight: videoStream.defaultVideoDimensions.height
      });
    }
  },
  onStreamingTimeout: function onStreamingTimeout(callback) {
    if (utils.isFunction(callback)) {
      callback({
        error: true,
        errorCode: 'getUserMedia',
        errorMsg: 'There was an issue with the getUserMedia API - Timed out while trying to start streaming',
        image: null,
        cameraStream: {}
      });
    }
  },
  stream: function stream(obj) {
    const existingVideo = utils.isArray(obj.existingVideo) ? obj.existingVideo[0] : obj.existingVideo;
    const cameraStream = obj.cameraStream;
    const completedCallback = obj.completedCallback;
    const streamedCallback = obj.streamedCallback;
    const videoElement = obj.videoElement;
    if (utils.isFunction(streamedCallback)) {
      streamedCallback();
    }
    if (existingVideo) {
      if (utils.isString(existingVideo)) {
        videoElement.src = existingVideo;
        videoElement.innerHTML = "<source src=\"".concat(existingVideo, "\" type=\"video/").concat(utils.getExtension(existingVideo), "\" />");
      } else if (existingVideo instanceof Blob) {
        try {
          videoElement.src = utils.URL.createObjectURL(existingVideo);
        } catch (e) {}
        videoElement.innerHTML = "<source src=\"".concat(existingVideo, "\" type=\"").concat(existingVideo.type, "\" />");
      }
    } else if (videoElement.mozSrcObject) {
      videoElement.mozSrcObject = cameraStream;
    } else if (utils.URL) {
      try {
        videoElement.srcObject = cameraStream;
        videoElement.src = utils.URL.createObjectURL(cameraStream);
      } catch (e) {
        videoElement.srcObject = cameraStream;
      }
    }
    videoElement.play();
    utils.requestTimeout(function checkLoadedData() {
      checkLoadedData.count = checkLoadedData.count || 0;
      if (videoStream.loadedData === true) {
        videoStream.findVideoSize({
          videoElement,
          cameraStream,
          completedCallback
        });
        videoStream.loadedData = false;
      } else {
        checkLoadedData.count += 1;
        if (checkLoadedData.count > 10) {
          videoStream.findVideoSize({
            videoElement,
            cameraStream,
            completedCallback
          });
        } else {
          checkLoadedData();
        }
      }
    }, 0);
  },
  startStreaming: function startStreaming(obj) {
    const errorCallback = utils.isFunction(obj.error) ? obj.error : utils.noop;
    const streamedCallback = utils.isFunction(obj.streamed) ? obj.streamed : utils.noop;
    const completedCallback = utils.isFunction(obj.completed) ? obj.completed : utils.noop;
    const crossOrigin = obj.crossOrigin;
    const existingVideo = obj.existingVideo;
    const lastCameraStream = obj.lastCameraStream;
    const options = obj.options;
    const webcamVideoElement = obj.webcamVideoElement;
    const videoElement = utils.isElement(existingVideo) ? existingVideo : webcamVideoElement ? webcamVideoElement : document.createElement('video');
    const cameraStream = void 0;
    if (crossOrigin) {
      videoElement.crossOrigin = options.crossOrigin;
    }
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.addEventListener('loadeddata', function (event) {
      videoStream.loadedData = true;
      if (options.offset) {
        videoElement.currentTime = options.offset;
      }
    });
    if (existingVideo) {
      videoStream.stream({
        videoElement,
        existingVideo,
        completedCallback
      });
    } else if (lastCameraStream) {
      videoStream.stream({
        videoElement,
        cameraStream: lastCameraStream,
        streamedCallback,
        completedCallback
      });
    } else {
      utils.getUserMedia({
        video: true
      }, function (stream) {
        videoStream.stream({
          videoElement,
          cameraStream: stream,
          streamedCallback,
          completedCallback
        });
      }, errorCallback);
    }
  },
  startVideoStreaming: function startVideoStreaming(callback) {
    const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const timeoutLength = options.timeout !== undefined ? options.timeout : 0;
    const originalCallback = options.callback;
    const webcamVideoElement = options.webcamVideoElement;
    let noGetUserMediaSupportTimeout = void 0;
    if (timeoutLength > 0) {
      noGetUserMediaSupportTimeout = utils.requestTimeout(function () {
        videoStream.onStreamingTimeout(originalCallback);
      }, 10000);
    }
    videoStream.startStreaming({
      error: function error() {
        originalCallback({
          error: true,
          errorCode: 'getUserMedia',
          errorMsg: 'There was an issue with the getUserMedia API - the user probably denied permission',
          image: null,
          cameraStream: {}
        });
      },
      streamed: function streamed() {
        clearTimeout(noGetUserMediaSupportTimeout);
      },
      completed: function completed() {
        const obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const cameraStream = obj.cameraStream;
        const videoElement = obj.videoElement;
        const videoHeight = obj.videoHeight;
        const videoWidth = obj.videoWidth;
        callback({
          cameraStream,
          videoElement,
          videoHeight,
          videoWidth
        });
      },
      lastCameraStream: options.lastCameraStream,
      webcamVideoElement,
      crossOrigin: options.crossOrigin,
      options
    });
  },
  stopVideoStreaming: function stopVideoStreaming(obj) {
    obj = utils.isObject(obj) ? obj : {};
    const _obj = obj;
    const keepCameraOn = _obj.keepCameraOn;
    const videoElement = _obj.videoElement;
    const webcamVideoElement = _obj.webcamVideoElement;
    const cameraStream = obj.cameraStream || {};
    const cameraStreamTracks = cameraStream.getTracks ? cameraStream.getTracks() || [] : [];
    const hasCameraStreamTracks = Boolean(cameraStreamTracks.length);
    const firstCameraStreamTrack = cameraStreamTracks[0];
    if (!keepCameraOn && hasCameraStreamTracks) {
      if (utils.isFunction(firstCameraStreamTrack.stop)) {
        firstCameraStreamTrack.stop();
      }
    }
    if (utils.isElement(videoElement) && !webcamVideoElement) {
      videoElement.pause();
      if (utils.isFunction(utils.URL.revokeObjectURL) && !utils.webWorkerError) {
        if (videoElement.src) {
          utils.URL.revokeObjectURL(videoElement.src);
        }
      }
      utils.removeElement(videoElement);
    }
  }
};
function stopVideoStreaming(options) {
  options = utils.isObject(options) ? options : {};
  videoStream.stopVideoStreaming(options);
}
function createAndGetGIF(obj, callback) {
  const options = obj.options || {};
  const images = options.images;
  const video = options.video;
  const gifWidth = Number(options.gifWidth);
  const gifHeight = Number(options.gifHeight);
  const numFrames = Number(options.numFrames);
  const cameraStream = obj.cameraStream;
  const videoElement = obj.videoElement;
  const videoWidth = obj.videoWidth;
  const videoHeight = obj.videoHeight;
  const cropDimensions = screenShot.getCropDimensions({
    videoWidth,
    videoHeight,
    gifHeight,
    gifWidth
  });
  const completeCallback = callback;
  options.crop = cropDimensions;
  options.videoElement = videoElement;
  options.videoWidth = videoWidth;
  options.videoHeight = videoHeight;
  options.cameraStream = cameraStream;
  if (!utils.isElement(videoElement)) {
    return;
  }
  videoElement.width = gifWidth + cropDimensions.width;
  videoElement.height = gifHeight + cropDimensions.height;
  if (!options.webcamVideoElement) {
    utils.setCSSAttr(videoElement, {
      position: 'fixed',
      opacity: '0'
    });
    document.body.appendChild(videoElement);
  }
  videoElement.play();
  screenShot.getGIF(options, function (obj) {
    if ((!images || !images.length) && (!video || !video.length)) {
      stopVideoStreaming(obj);
    }
    completeCallback(obj);
  });
}
function existingVideo() {
  const obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const callback = obj.callback;
  let existingVideo = obj.existingVideo;
  const options = obj.options;
  const skipObj = {
    getUserMedia: true,
    'globalThis.URL': true
  };
  const errorObj = error.validate(skipObj);
  const loadedImages = 0;
  let videoType = void 0;
  let videoSrc = void 0;
  const tempImage = void 0;
  const ag = void 0;
  if (errorObj.error) {
    return callback(errorObj);
  }
  if (utils.isElement(existingVideo) && existingVideo.src) {
    videoSrc = existingVideo.src;
    videoType = utils.getExtension(videoSrc);
    if (!utils.isSupported.videoCodecs[videoType]) {
      return callback(error.messages.videoCodecs);
    }
  } else if (utils.isArray(existingVideo)) {
    utils.each(existingVideo, function (iterator, videoSrc) {
      if (videoSrc instanceof Blob) {
        videoType = videoSrc.type.substr(videoSrc.type.lastIndexOf('/') + 1, videoSrc.length);
      } else {
        videoType = videoSrc.substr(videoSrc.lastIndexOf('.') + 1, videoSrc.length);
      }
      if (utils.isSupported.videoCodecs[videoType]) {
        existingVideo = videoSrc;
        return false;
      }
    });
  }
  videoStream.startStreaming({
    completed: function completed(obj) {
      obj.options = options || {};
      createAndGetGIF(obj, callback);
    },
    existingVideo,
    crossOrigin: options.crossOrigin,
    options
  });
}
function existingWebcam() {
  const obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const callback = obj.callback;
  const lastCameraStream = obj.lastCameraStream;
  const options = obj.options;
  const webcamVideoElement = obj.webcamVideoElement;
  if (!isWebCamGIFSupported()) {
    return callback(error.validate());
  }
  if (options.savedRenderingContexts.length) {
    screenShot.getGIF(options, function (obj) {
      callback(obj);
    });
    return;
  }
  videoStream.startVideoStreaming(function () {
    const obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    obj.options = options || {};
    createAndGetGIF(obj, callback);
  }, {
    lastCameraStream,
    callback,
    webcamVideoElement,
    crossOrigin: options.crossOrigin
  });
}
function createGIF(userOptions, callback) {
  callback = utils.isFunction(userOptions) ? userOptions : callback;
  userOptions = utils.isObject(userOptions) ? userOptions : {};
  if (!utils.isFunction(callback)) {
    return;
  }
  let options = utils.normalizeOptions(defaultOptions, userOptions) || {};
  const lastCameraStream = userOptions.cameraStream;
  const images = options.images;
  const imagesLength = images ? images.length : 0;
  const video = options.video;
  const webcamVideoElement = options.webcamVideoElement;
  options = utils.normalizeOptions(options, {
    gifWidth: Math.floor(options.gifWidth),
    gifHeight: Math.floor(options.gifHeight)
  });
  if (imagesLength) {
    existingImages({
      images,
      imagesLength,
      callback,
      options
    });
  } else if (video) {
    existingVideo({
      existingVideo: video,
      callback,
      options
    });
  } else {
    existingWebcam({
      lastCameraStream,
      callback,
      webcamVideoElement,
      options
    });
  }
}
function takeSnapShot(userOptions, callback) {
  callback = utils.isFunction(userOptions) ? userOptions : callback;
  userOptions = utils.isObject(userOptions) ? userOptions : {};
  if (!utils.isFunction(callback)) {
    return;
  }
  const mergedOptions = utils.normalizeOptions(defaultOptions, userOptions);
  const options = utils.normalizeOptions(mergedOptions, {
    interval: 0.1,
    numFrames: 1,
    gifWidth: Math.floor(mergedOptions.gifWidth),
    gifHeight: Math.floor(mergedOptions.gifHeight)
  });
  createGIF(options, callback);
}
const API = {
  utils: utils$2,
  error: error$2,
  defaultOptions: defaultOptions$2,
  createGIF,
  takeSnapShot,
  stopVideoStreaming,
  isSupported,
  isWebCamGIFSupported,
  isExistingVideoGIFSupported,
  isExistingImagesGIFSupported: isSupported$1,
  VERSION: '0.4.5'
};
export default API;
//# sourceMappingURL=gifshot.js.map