"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _readOnlyError2 = _interopRequireDefault(require("@babel/runtime/helpers/readOnlyError"));
var utils = {
  URL: globalThis.URL || globalThis.webkitURL || globalThis.mozURL || globalThis.msURL,
  getUserMedia: function () {
    if (!globalThis.navigator) return globalThis.navigator;
    var getUserMedia = globalThis.navigator.getUserMedia || globalThis.navigator.webkitGetUserMedia || globalThis.navigator.mozGetUserMedia || globalThis.navigator.msGetUserMedia;
    return getUserMedia ? getUserMedia.bind(globalThis.navigator) : getUserMedia;
  }(),
  requestAnimFrame: globalThis.requestAnimationFrame || globalThis.webkitRequestAnimationFrame || globalThis.mozRequestAnimationFrame || globalThis.oRequestAnimationFrame || globalThis.msRequestAnimationFrame,
  requestTimeout: function requestTimeout(callback, delay) {
    callback = callback || utils.noop;
    delay = delay || 0;
    if (!utils.requestAnimFrame) {
      return setTimeout(callback, delay);
    }
    var start = new Date().getTime();
    var handle = new Object();
    var requestAnimFrame = utils.requestAnimFrame;
    var loop = function loop() {
      var current = new Date().getTime();
      var delta = current - start;
      delta >= delay ? callback.call() : handle.value = requestAnimFrame(loop);
    };
    handle.value = requestAnimFrame(loop);
    return handle;
  },
  Blob: globalThis.Blob || globalThis.BlobBuilder || globalThis.WebKitBlobBuilder || globalThis.MozBlobBuilder || globalThis.MSBlobBuilder,
  btoa: function () {
    var btoa = globalThis.btoa || function (input) {
      var output = '';
      var i = 0;
      var l = input.length;
      var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var chr1 = void 0;
      var chr2 = void 0;
      var chr3 = void 0;
      var enc1 = void 0;
      var enc2 = void 0;
      var enc3 = void 0;
      var enc4 = void 0;
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
      var el = document.createElement('canvas');
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
      var testEl = document.createElement('video');
      var supportObj = {
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
    var x = void 0;
    var len = void 0;
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
    var newObj = {};
    utils.each(defaultOptions, function (key, val) {
      newObj[key] = defaultOptions[key];
    });
    utils.each(userOptions, function (key, val) {
      var currentUserOption = userOptions[key];
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
      var blob = new utils.Blob([content], {
        type: 'text/javascript'
      });
      var objectUrl = utils.URL.createObjectURL(blob);
      var worker = new Worker(objectUrl);
      return {
        objectUrl: objectUrl,
        worker: worker
      };
    } catch (e) {
      return "".concat(e);
    }
  },
  getExtension: function getExtension(src) {
    return src.substr(src.lastIndexOf('.') + 1, src.length);
  },
  getFontSize: function getFontSize() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!document.body || options.resizeFont === false) {
      return options.fontSize;
    }
    var text = options.text;
    var containerWidth = options.gifWidth;
    var fontSize = parseInt(options.fontSize, 10);
    var minFontSize = parseInt(options.minFontSize, 10);
    var div = document.createElement('div');
    var span = document.createElement('span');
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
var utils$2 = Object.freeze({
  default: utils
});
var error = {
  validate: function validate(skipObj) {
    skipObj = utils.isObject(skipObj) ? skipObj : {};
    var errorObj = {};
    utils.each(error.validators, function (indece, currentValidator) {
      var errorCode = currentValidator.errorCode;
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
    var errorObj = error.validate(skipObj);
    var isValid = errorObj.error !== true;
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
var error$2 = Object.freeze({
  default: error
});
var noop = function noop() {};
var defaultOptions = {
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
var defaultOptions$2 = Object.freeze({
  default: defaultOptions
});
function isSupported() {
  return error.isValid();
}
function isWebCamGIFSupported() {
  return error.isValid();
}
function isSupported$1() {
  var options = {
    getUserMedia: true
  };
  return error.isValid(options);
}
function isExistingVideoGIFSupported(codecs) {
  var hasValidCodec = false;
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
  var netsize = 256;
  var prime1 = 499;
  var prime2 = 491;
  var prime3 = 487;
  var prime4 = 503;
  var minpicturebytes = 3 * prime4;
  var maxnetpos = netsize - 1;
  var netbiasshift = 4;
  var ncycles = 100;
  var intbiasshift = 16;
  var intbias = 1 << intbiasshift;
  var gammashift = 10;
  var gamma = 1 << gammashift;
  var betashift = 10;
  var beta = intbias >> betashift;
  var betagamma = intbias << gammashift - betashift;
  var initrad = netsize >> 3;
  var radiusbiasshift = 6;
  var radiusbias = 1 << radiusbiasshift;
  var initradius = initrad * radiusbias;
  var radiusdec = 30;
  var alphabiasshift = 10;
  var initalpha = 1 << alphabiasshift;
  var alphadec;
  var radbiasshift = 8;
  var radbias = 1 << radbiasshift;
  var alpharadbshift = alphabiasshift + radbiasshift;
  var alpharadbias = 1 << alpharadbshift;
  var thepicture;
  var lengthcount;
  var samplefac;
  var network;
  var netindex = [];
  var bias = [];
  var freq = [];
  var radpower = [];
  function NeuQuantConstructor(thepic, len, sample) {
    var i;
    var p;
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
    var map = [];
    var index = new Array(netsize);
    for (var i = 0; i < netsize; i++) {
      index[network[i][3]] = i;
    }
    var k = 0;
    for (var l = 0; l < netsize; l++) {
      var j = index[l];
      map[k++] = network[j][0];
      map[k++] = network[j][1];
      map[k++] = network[j][2];
    }
    return map;
  }
  function inxbuild() {
    var i;
    var j;
    var smallpos;
    var smallval;
    var p;
    var q;
    var previouscol;
    var startpos;
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
    var i;
    var j;
    var b;
    var g;
    var r;
    var radius;
    var rad;
    var alpha;
    var step;
    var delta;
    var samplepixels;
    var p;
    var pix;
    var lim;
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
    var i;
    var j;
    var dist;
    var a;
    var bestd;
    var p;
    var best;
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
    var i;
    var j;
    for (i = 0; i < netsize; i++) {
      network[i][0] >>= netbiasshift;
      network[i][1] >>= netbiasshift;
      network[i][2] >>= netbiasshift;
      network[i][3] = i;
    }
  }
  function alterneigh(rad, i, b, g, r) {
    var j;
    var k;
    var lo;
    var hi;
    var a;
    var m;
    var p;
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
    var n = network[i];
    var alphaMult = alpha / initalpha;
    n[0] -= alphaMult * (n[0] - b) | 0;
    n[1] -= alphaMult * (n[1] - g) | 0;
    n[2] -= alphaMult * (n[2] - r) | 0;
  }
  function contest(b, g, r) {
    var i;
    var dist;
    var a;
    var biasdist;
    var betafreq;
    var bestpos;
    var bestbiaspos;
    var bestd;
    var bestbiasd;
    var n;
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
  var exports = {};
  exports.map = map;
  exports.process = process;
  return exports;
}
function workerCode() {
  var self = this;
  try {
    globalThis.onmessage = function (ev) {
      var data = ev.data || {};
      var response;
      if (data.gifshot) {
        response = workerMethods.run(data);
        postMessage(response);
      }
    };
  } catch (e) {}
  var workerMethods = {
    dataToRGB: function dataToRGB(data, width, height) {
      var length = width * height * 4;
      var i = 0;
      var rgb = [];
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
      var paletteArray = [];
      for (var i = 0; i < paletteRGB.length; i += 3) {
        var r = paletteRGB[i];
        var g = paletteRGB[i + 1];
        var b = paletteRGB[i + 2];
        paletteArray.push(r << 16 | g << 8 | b);
      }
      return paletteArray;
    },
    processFrameWithQuantizer: function processFrameWithQuantizer(imageData, width, height, sampleInterval) {
      var rgbComponents = this.dataToRGB(imageData, width, height);
      var nq = new NeuQuant(rgbComponents, rgbComponents.length, sampleInterval);
      var paletteRGB = nq.process();
      var paletteArray = new Uint32Array(this.componentizedPaletteToArray(paletteRGB));
      var numberPixels = width * height;
      var indexedPixels = new Uint8Array(numberPixels);
      var k = 0;
      for (var i = 0; i < numberPixels; i++) {
        var r = rgbComponents[k++];
        var g = rgbComponents[k++];
        var b = rgbComponents[k++];
        indexedPixels[i] = nq.map(r, g, b);
      }
      return {
        pixels: indexedPixels,
        palette: paletteArray
      };
    },
    run: function run(frame) {
      frame = frame || {};
      var _frame = frame;
      var height = _frame.height;
      var palette = _frame.palette;
      var sampleInterval = _frame.sampleInterval;
      var width = _frame.width;
      var imageData = frame.data;
      return this.processFrameWithQuantizer(imageData, width, height, sampleInterval);
    }
  };
  return workerMethods;
}
function gifWriter(buf, width, height, gopts) {
  var p = 0;
  gopts = gopts === undefined ? {} : gopts;
  var loop_count = gopts.loop === undefined ? null : gopts.loop;
  var global_palette = gopts.palette === undefined ? null : gopts.palette;
  if (width <= 0 || height <= 0 || width > 65535 || height > 65535) throw 'Width/Height invalid.';
  function check_palette_and_num_colors(palette) {
    var num_colors = palette.length;
    if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1) throw 'Invalid code/color length, must be power of 2 and 2 .. 256.';
    return num_colors;
  }
  buf[p++] = 0x47;
  buf[p++] = 0x49;
  buf[p++] = 0x46;
  buf[p++] = 0x38;
  buf[p++] = 0x39;
  buf[p++] = 0x61;
  var gp_num_colors_pow2 = 0;
  var background = 0;
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
  var ended = false;
  this.addFrame = function (x, y, w, h, indexed_pixels, opts) {
    if (ended === true) {
      --p;
      ended = false;
    }
    opts = opts === undefined ? {} : opts;
    if (x < 0 || y < 0 || x > 65535 || y > 65535) throw 'x/y invalid.';
    if (w <= 0 || h <= 0 || w > 65535 || h > 65535) throw 'Width/Height invalid.';
    if (indexed_pixels.length < w * h) throw 'Not enough pixels for the frame size.';
    var using_local_palette = true;
    var palette = opts.palette;
    if (palette === undefined || palette === null) {
      using_local_palette = false;
      palette = global_palette;
    }
    if (palette === undefined || palette === null) throw 'Must supply either a local or global palette.';
    var num_colors = check_palette_and_num_colors(palette);
    var min_code_size = 0;
    while (num_colors >>= 1) {
      ++min_code_size;
    }
    num_colors = 1 << min_code_size;
    var delay = opts.delay === undefined ? 0 : opts.delay;
    var disposal = opts.disposal === undefined ? 0 : opts.disposal;
    if (disposal < 0 || disposal > 3) throw 'Disposal out of range.';
    var use_transparency = false;
    var transparent_index = 0;
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
      for (var i = 0, il = palette.length; i < il; ++i) {
        var rgb = palette[i];
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
    var cur_subblock = p++;
    var clear_code = 1 << min_code_size;
    var code_mask = clear_code - 1;
    var eoi_code = clear_code + 1;
    var next_code = eoi_code + 1;
    var cur_code_size = min_code_size + 1;
    var cur_shift = 0;
    var cur = 0;
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
    var ib_code = index_stream[0] & code_mask;
    var code_table = {};
    emit_code(clear_code);
    for (var i = 1, il = index_stream.length; i < il; ++i) {
      var k = index_stream[i] & code_mask;
      var cur_key = ib_code << 8 | k;
      var cur_code = code_table[cur_key];
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
var noop$2 = function noop() {};
var AnimatedGIF = function AnimatedGIF(options) {
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
    var self = this;
    var processFrameWorkerCode = "".concat(NeuQuant.toString(), "(").concat(workerCode.toString(), "());");
    var webWorkerObj = void 0;
    var objectUrl = void 0;
    var webWorker = void 0;
    var numWorkers = void 0;
    var x = -1;
    var workerError = '';
    numWorkers = options.numWorkers;
    while (++x < numWorkers) {
      webWorkerObj = utils.createWebWorker(processFrameWorkerCode);
      if (utils.isObject(webWorkerObj)) {
        objectUrl = webWorkerObj.objectUrl;
        webWorker = webWorkerObj.worker;
        self.workers.push({
          worker: webWorker,
          objectUrl: objectUrl
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
    var byteMap = [];
    for (var i = 0; i < 256; i++) {
      byteMap[i] = String.fromCharCode(i);
    }
    return byteMap;
  }(),
  bufferToString: function bufferToString(buffer) {
    var numberValues = buffer.length;
    var str = '';
    var x = -1;
    while (++x < numberValues) {
      str += this.byteMap[buffer[x]];
    }
    return str;
  },
  onFrameFinished: function onFrameFinished(progressCallback) {
    var self = this;
    var frames = self.frames;
    var options = self.options;
    var hasExistingImages = Boolean((options.images || []).length);
    var allDone = frames.every(function (frame) {
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
    var AnimatedGifContext = this;
    var options = this.options;
    var _options = this.options;
    var progressCallback = _options.progressCallback;
    var sampleInterval = _options.sampleInterval;
    var frames = this.frames;
    var frame = void 0;
    var worker = void 0;
    var done = function done() {
      var ev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var data = ev.data;
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
    for (var i = 0; i < this.options.numWorkers && i < this.frames.length; i++) {
      this.processFrame(i);
    }
  },
  processNextFrame: function processNextFrame() {
    var position = -1;
    for (var i = 0; i < this.frames.length; i++) {
      var frame = this.frames[i];
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
    var buffer = [];
    var gifOptions = {
      loop: this.repeat
    };
    var options = this.options;
    var interval = options.interval;
    var frameDuration = options.frameDuration;
    var existingImages = options.images;
    var hasExistingImages = Boolean(existingImages.length);
    var height = options.gifHeight;
    var width = options.gifWidth;
    var gifWriter$$1 = new gifWriter(buffer, width, height, gifOptions);
    var onRenderProgressCallback = this.onRenderProgressCallback;
    var delay = hasExistingImages ? interval * 100 : 0;
    var bufferToString = void 0;
    var gif = void 0;
    this.generatingGIF = true;
    utils.each(frames, function (iterator, frame) {
      var framePalette = frame.palette;
      onRenderProgressCallback(0.75 + 0.25 * frame.position * 1.0 / frames.length);
      for (var i = 0; i < frameDuration; i++) {
        gifWriter$$1.addFrame(0, 0, width, height, frame.pixels, {
          palette: framePalette,
          delay: delay
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
    var self = this;
    var ctx = self.ctx;
    var options = self.options;
    var width = options.gifWidth;
    var height = options.gifHeight;
    var fontSize = utils.getFontSize(gifshotOptions);
    var _gifshotOptions = gifshotOptions;
    var filter = _gifshotOptions.filter;
    var fontColor = _gifshotOptions.fontColor;
    var fontFamily = _gifshotOptions.fontFamily;
    var fontWeight = _gifshotOptions.fontWeight;
    var gifHeight = _gifshotOptions.gifHeight;
    var gifWidth = _gifshotOptions.gifWidth;
    var text = _gifshotOptions.text;
    var textAlign = _gifshotOptions.textAlign;
    var textBaseline = _gifshotOptions.textBaseline;
    var textXCoordinate = gifshotOptions.textXCoordinate ? gifshotOptions.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? width : width / 2;
    var textYCoordinate = gifshotOptions.textYCoordinate ? gifshotOptions.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? height / 2 : height;
    var font = "".concat(fontWeight, " ").concat(fontSize, " ").concat(fontFamily);
    var imageData = void 0;
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
    var imageData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var frames = this.frames;
    var imageDataArray = imageData.data;
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
    var self = this;
    var onRenderComplete = function onRenderComplete(gif) {
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
    var workers = this.workers;
    utils.each(workers, function (iterator, workerObj) {
      var worker = workerObj.worker;
      var objectUrl = workerObj.objectUrl;
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
      image: image
    });
  });
}
function existingImages() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var self = this;
  var callback = obj.callback;
  var images = obj.images;
  var options = obj.options;
  var imagesLength = obj.imagesLength;
  var skipObj = {
    getUserMedia: true,
    'globalThis.URL': true
  };
  var errorObj = error.validate(skipObj);
  var loadedImages = [];
  var loadedImagesLength = 0;
  var tempImage = void 0;
  var ag = void 0;
  if (errorObj.error) {
    return callback(errorObj);
  }
  ag = new AnimatedGIF(options);
  utils.each(images, function (index, image) {
    var currentImage = image;
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
          var obj = void 0;
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
var noop$3 = function noop() {};
var screenShot = {
  getGIF: function getGIF() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments[1];
    callback = utils.isFunction(callback) ? callback : noop$3;
    var canvas = document.createElement('canvas');
    var context = void 0;
    var existingImages = options.images;
    var hasExistingImages = Boolean(existingImages.length);
    var cameraStream = options.cameraStream;
    var crop = options.crop;
    var filter = options.filter;
    var fontColor = options.fontColor;
    var fontFamily = options.fontFamily;
    var fontWeight = options.fontWeight;
    var keepCameraOn = options.keepCameraOn;
    var numWorkers = options.numWorkers;
    var progressCallback = options.progressCallback;
    var saveRenderingContexts = options.saveRenderingContexts;
    var savedRenderingContexts = options.savedRenderingContexts;
    var text = options.text;
    var textAlign = options.textAlign;
    var textBaseline = options.textBaseline;
    var videoElement = options.videoElement;
    var videoHeight = options.videoHeight;
    var videoWidth = options.videoWidth;
    var webcamVideoElement = options.webcamVideoElement;
    var gifWidth = Number(options.gifWidth);
    var gifHeight = Number(options.gifHeight);
    var interval = Number(options.interval);
    var sampleInterval = Number(options.sampleInterval);
    var waitBetweenFrames = hasExistingImages ? 0 : interval * 1000;
    var renderingContextsToSave = [];
    var numFrames = savedRenderingContexts.length ? savedRenderingContexts.length : options.numFrames;
    var pendingFrames = numFrames;
    var ag = new AnimatedGIF(options);
    var fontSize = utils.getFontSize(options);
    var textXCoordinate = options.textXCoordinate ? options.textXCoordinate : textAlign === 'left' ? 1 : textAlign === 'right' ? gifWidth : gifWidth / 2;
    var textYCoordinate = options.textYCoordinate ? options.textYCoordinate : textBaseline === 'top' ? 1 : textBaseline === 'center' ? gifHeight / 2 : gifHeight;
    var font = "".concat(fontWeight, " ").concat(fontSize, " ").concat(fontFamily);
    var sourceX = crop ? Math.floor(crop.scaledWidth / 2) : 0;
    var sourceWidth = crop ? videoWidth - crop.scaledWidth : 0;
    var sourceY = crop ? Math.floor(crop.scaledHeight / 2) : 0;
    var sourceHeight = crop ? videoHeight - crop.scaledHeight : 0;
    var captureFrames = function captureSingleFrame() {
      var framesLeft = pendingFrames - 1;
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
        var imageData = void 0;
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
              image: image,
              cameraStream: cameraStream,
              videoElement: videoElement,
              webcamVideoElement: webcamVideoElement,
              savedRenderingContexts: renderingContextsToSave,
              keepCameraOn: keepCameraOn
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
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var width = obj.videoWidth;
    var height = obj.videoHeight;
    var gifWidth = obj.gifWidth;
    var gifHeight = obj.gifHeight;
    var result = {
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
    var cameraStream = obj.cameraStream;
    var completedCallback = obj.completedCallback;
    var videoElement = obj.videoElement;
    if (!videoElement) {
      return;
    }
    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
      videoElement.removeEventListener('loadeddata', videoStream.findVideoSize);
      completedCallback({
        videoElement: videoElement,
        cameraStream: cameraStream,
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
        videoElement: videoElement,
        cameraStream: cameraStream,
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
    var existingVideo = utils.isArray(obj.existingVideo) ? obj.existingVideo[0] : obj.existingVideo;
    var cameraStream = obj.cameraStream;
    var completedCallback = obj.completedCallback;
    var streamedCallback = obj.streamedCallback;
    var videoElement = obj.videoElement;
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
          videoElement: videoElement,
          cameraStream: cameraStream,
          completedCallback: completedCallback
        });
        videoStream.loadedData = false;
      } else {
        checkLoadedData.count += 1;
        if (checkLoadedData.count > 10) {
          videoStream.findVideoSize({
            videoElement: videoElement,
            cameraStream: cameraStream,
            completedCallback: completedCallback
          });
        } else {
          checkLoadedData();
        }
      }
    }, 0);
  },
  startStreaming: function startStreaming(obj) {
    var errorCallback = utils.isFunction(obj.error) ? obj.error : utils.noop;
    var streamedCallback = utils.isFunction(obj.streamed) ? obj.streamed : utils.noop;
    var completedCallback = utils.isFunction(obj.completed) ? obj.completed : utils.noop;
    var crossOrigin = obj.crossOrigin;
    var existingVideo = obj.existingVideo;
    var lastCameraStream = obj.lastCameraStream;
    var options = obj.options;
    var webcamVideoElement = obj.webcamVideoElement;
    var videoElement = utils.isElement(existingVideo) ? existingVideo : webcamVideoElement ? webcamVideoElement : document.createElement('video');
    var cameraStream = void 0;
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
        videoElement: videoElement,
        existingVideo: existingVideo,
        completedCallback: completedCallback
      });
    } else if (lastCameraStream) {
      videoStream.stream({
        videoElement: videoElement,
        cameraStream: lastCameraStream,
        streamedCallback: streamedCallback,
        completedCallback: completedCallback
      });
    } else {
      utils.getUserMedia({
        video: true
      }, function (stream) {
        videoStream.stream({
          videoElement: videoElement,
          cameraStream: stream,
          streamedCallback: streamedCallback,
          completedCallback: completedCallback
        });
      }, errorCallback);
    }
  },
  startVideoStreaming: function startVideoStreaming(callback) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var timeoutLength = options.timeout !== undefined ? options.timeout : 0;
    var originalCallback = options.callback;
    var webcamVideoElement = options.webcamVideoElement;
    var noGetUserMediaSupportTimeout = void 0;
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
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var cameraStream = obj.cameraStream;
        var videoElement = obj.videoElement;
        var videoHeight = obj.videoHeight;
        var videoWidth = obj.videoWidth;
        callback({
          cameraStream: cameraStream,
          videoElement: videoElement,
          videoHeight: videoHeight,
          videoWidth: videoWidth
        });
      },
      lastCameraStream: options.lastCameraStream,
      webcamVideoElement: webcamVideoElement,
      crossOrigin: options.crossOrigin,
      options: options
    });
  },
  stopVideoStreaming: function stopVideoStreaming(obj) {
    obj = utils.isObject(obj) ? obj : {};
    var _obj = obj;
    var keepCameraOn = _obj.keepCameraOn;
    var videoElement = _obj.videoElement;
    var webcamVideoElement = _obj.webcamVideoElement;
    var cameraStream = obj.cameraStream || {};
    var cameraStreamTracks = cameraStream.getTracks ? cameraStream.getTracks() || [] : [];
    var hasCameraStreamTracks = Boolean(cameraStreamTracks.length);
    var firstCameraStreamTrack = cameraStreamTracks[0];
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
  var options = obj.options || {};
  var images = options.images;
  var video = options.video;
  var gifWidth = Number(options.gifWidth);
  var gifHeight = Number(options.gifHeight);
  var numFrames = Number(options.numFrames);
  var cameraStream = obj.cameraStream;
  var videoElement = obj.videoElement;
  var videoWidth = obj.videoWidth;
  var videoHeight = obj.videoHeight;
  var cropDimensions = screenShot.getCropDimensions({
    videoWidth: videoWidth,
    videoHeight: videoHeight,
    gifHeight: gifHeight,
    gifWidth: gifWidth
  });
  var completeCallback = callback;
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
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = obj.callback;
  var existingVideo = obj.existingVideo;
  var options = obj.options;
  var skipObj = {
    getUserMedia: true,
    'globalThis.URL': true
  };
  var errorObj = error.validate(skipObj);
  var loadedImages = 0;
  var videoType = void 0;
  var videoSrc = void 0;
  var tempImage = void 0;
  var ag = void 0;
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
    existingVideo: existingVideo,
    crossOrigin: options.crossOrigin,
    options: options
  });
}
function existingWebcam() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = obj.callback;
  var lastCameraStream = obj.lastCameraStream;
  var options = obj.options;
  var webcamVideoElement = obj.webcamVideoElement;
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
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    obj.options = options || {};
    createAndGetGIF(obj, callback);
  }, {
    lastCameraStream: lastCameraStream,
    callback: callback,
    webcamVideoElement: webcamVideoElement,
    crossOrigin: options.crossOrigin
  });
}
function createGIF(userOptions, callback) {
  callback = utils.isFunction(userOptions) ? userOptions : callback;
  userOptions = utils.isObject(userOptions) ? userOptions : {};
  if (!utils.isFunction(callback)) {
    return;
  }
  var options = utils.normalizeOptions(defaultOptions, userOptions) || {};
  var lastCameraStream = userOptions.cameraStream;
  var images = options.images;
  var imagesLength = images ? images.length : 0;
  var video = options.video;
  var webcamVideoElement = options.webcamVideoElement;
  options = utils.normalizeOptions(options, {
    gifWidth: Math.floor(options.gifWidth),
    gifHeight: Math.floor(options.gifHeight)
  });
  if (imagesLength) {
    existingImages({
      images: images,
      imagesLength: imagesLength,
      callback: callback,
      options: options
    });
  } else if (video) {
    existingVideo({
      existingVideo: video,
      callback: callback,
      options: options
    });
  } else {
    existingWebcam({
      lastCameraStream: lastCameraStream,
      callback: callback,
      webcamVideoElement: webcamVideoElement,
      options: options
    });
  }
}
function takeSnapShot(userOptions, callback) {
  callback = utils.isFunction(userOptions) ? userOptions : callback;
  userOptions = utils.isObject(userOptions) ? userOptions : {};
  if (!utils.isFunction(callback)) {
    return;
  }
  var mergedOptions = utils.normalizeOptions(defaultOptions, userOptions);
  var options = utils.normalizeOptions(mergedOptions, {
    interval: 0.1,
    numFrames: 1,
    gifWidth: Math.floor(mergedOptions.gifWidth),
    gifHeight: Math.floor(mergedOptions.gifHeight)
  });
  createGIF(options, callback);
}
var API = {
  utils: utils$2,
  error: error$2,
  defaultOptions: defaultOptions$2,
  createGIF: createGIF,
  takeSnapShot: takeSnapShot,
  stopVideoStreaming: stopVideoStreaming,
  isSupported: isSupported,
  isWebCamGIFSupported: isWebCamGIFSupported,
  isExistingVideoGIFSupported: isExistingVideoGIFSupported,
  isExistingImagesGIFSupported: isSupported$1,
  VERSION: '0.4.5'
};
var _default = API;
exports.default = _default;
//# sourceMappingURL=gifshot.js.map