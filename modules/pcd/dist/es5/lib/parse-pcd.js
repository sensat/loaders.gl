"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parsePCD;
var _schema = require("@loaders.gl/schema");
var _decompressLzf = require("./decompress-lzf");
var _getPcdSchema = require("./get-pcd-schema");
var LITTLE_ENDIAN = true;
function parsePCD(data) {
  var textData = new TextDecoder().decode(data);
  var pcdHeader = parsePCDHeader(textData);
  var attributes = {};
  switch (pcdHeader.data) {
    case 'ascii':
      attributes = parsePCDASCII(pcdHeader, textData);
      break;
    case 'binary':
      attributes = parsePCDBinary(pcdHeader, data);
      break;
    case 'binary_compressed':
      attributes = parsePCDBinaryCompressed(pcdHeader, data);
      break;
    default:
      throw new Error("PCD: ".concat(pcdHeader.data, " files are not supported"));
  }
  attributes = getMeshAttributes(attributes);
  var header = getMeshHeader(pcdHeader, attributes);
  var metadata = Object.fromEntries([['mode', '0'], ['boundingBox', JSON.stringify(header.boundingBox)]]);
  var schema = (0, _getPcdSchema.getPCDSchema)(pcdHeader, metadata);
  return {
    loader: 'pcd',
    loaderData: pcdHeader,
    header: header,
    schema: schema,
    mode: 0,
    topology: 'point-list',
    attributes: attributes
  };
}
function getMeshHeader(pcdHeader, attributes) {
  if (typeof pcdHeader.width === 'number' && typeof pcdHeader.height === 'number') {
    var pointCount = pcdHeader.width * pcdHeader.height;
    return {
      vertexCount: pointCount,
      boundingBox: (0, _schema.getMeshBoundingBox)(attributes)
    };
  }
  return {
    vertexCount: pcdHeader.vertexCount,
    boundingBox: pcdHeader.boundingBox
  };
}
function getMeshAttributes(attributes) {
  var normalizedAttributes = {
    POSITION: {
      value: new Float32Array(attributes.position),
      size: 3
    }
  };
  if (attributes.normal && attributes.normal.length > 0) {
    normalizedAttributes.NORMAL = {
      value: new Float32Array(attributes.normal),
      size: 3
    };
  }
  if (attributes.color && attributes.color.length > 0) {
    normalizedAttributes.COLOR_0 = {
      value: new Uint8Array(attributes.color),
      size: 3
    };
  }
  if (attributes.intensity && attributes.intensity.length > 0) {
    normalizedAttributes.COLOR_0 = {
      value: new Uint8Array(attributes.color),
      size: 3
    };
  }
  if (attributes.label && attributes.label.length > 0) {
    normalizedAttributes.COLOR_0 = {
      value: new Uint8Array(attributes.label),
      size: 3
    };
  }
  return normalizedAttributes;
}
function parsePCDHeader(data) {
  var result1 = data.search(/[\r\n]DATA\s(\S*)\s/i);
  var result2 = /[\r\n]DATA\s(\S*)\s/i.exec(data.substr(result1 - 1));
  var pcdHeader = {};
  pcdHeader.data = result2 && result2[1];
  if (result2 !== null) {
    pcdHeader.headerLen = (result2 && result2[0].length) + result1;
  }
  pcdHeader.str = data.substr(0, pcdHeader.headerLen);
  pcdHeader.str = pcdHeader.str.replace(/\#.*/gi, '');
  pcdHeader.version = /VERSION (.*)/i.exec(pcdHeader.str);
  pcdHeader.fields = /FIELDS (.*)/i.exec(pcdHeader.str);
  pcdHeader.size = /SIZE (.*)/i.exec(pcdHeader.str);
  pcdHeader.type = /TYPE (.*)/i.exec(pcdHeader.str);
  pcdHeader.count = /COUNT (.*)/i.exec(pcdHeader.str);
  pcdHeader.width = /WIDTH (.*)/i.exec(pcdHeader.str);
  pcdHeader.height = /HEIGHT (.*)/i.exec(pcdHeader.str);
  pcdHeader.viewpoint = /VIEWPOINT (.*)/i.exec(pcdHeader.str);
  pcdHeader.points = /POINTS (.*)/i.exec(pcdHeader.str);
  if (pcdHeader.version !== null) {
    pcdHeader.version = parseFloat(pcdHeader.version[1]);
  }
  if (pcdHeader.fields !== null) {
    pcdHeader.fields = pcdHeader.fields[1].split(' ');
  }
  if (pcdHeader.type !== null) {
    pcdHeader.type = pcdHeader.type[1].split(' ');
  }
  if (pcdHeader.width !== null) {
    pcdHeader.width = parseInt(pcdHeader.width[1], 10);
  }
  if (pcdHeader.height !== null) {
    pcdHeader.height = parseInt(pcdHeader.height[1], 10);
  }
  if (pcdHeader.viewpoint !== null) {
    pcdHeader.viewpoint = pcdHeader.viewpoint[1];
  }
  if (pcdHeader.points !== null) {
    pcdHeader.points = parseInt(pcdHeader.points[1], 10);
  }
  if (pcdHeader.points === null && typeof pcdHeader.width === 'number' && typeof pcdHeader.height === 'number') {
    pcdHeader.points = pcdHeader.width * pcdHeader.height;
  }
  if (pcdHeader.size !== null) {
    pcdHeader.size = pcdHeader.size[1].split(' ').map(function (x) {
      return parseInt(x, 10);
    });
  }
  if (pcdHeader.count !== null) {
    pcdHeader.count = pcdHeader.count[1].split(' ').map(function (x) {
      return parseInt(x, 10);
    });
  } else {
    pcdHeader.count = [];
    if (pcdHeader.fields !== null) {
      for (var i = 0; i < pcdHeader.fields.length; i++) {
        pcdHeader.count.push(1);
      }
    }
  }
  pcdHeader.offset = {};
  var sizeSum = 0;
  if (pcdHeader.fields !== null && pcdHeader.size !== null) {
    for (var _i = 0; _i < pcdHeader.fields.length; _i++) {
      if (pcdHeader.data === 'ascii') {
        pcdHeader.offset[pcdHeader.fields[_i]] = _i;
      } else {
        pcdHeader.offset[pcdHeader.fields[_i]] = sizeSum;
        sizeSum += pcdHeader.size[_i];
      }
    }
  }
  pcdHeader.rowSize = sizeSum;
  return pcdHeader;
}
function parsePCDASCII(pcdHeader, textData) {
  var position = [];
  var normal = [];
  var color = [];
  var intensity = [];
  var label = [];
  var offset = pcdHeader.offset;
  var pcdData = textData.substr(pcdHeader.headerLen);
  var lines = pcdData.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i] !== '') {
      var line = lines[i].split(' ');
      if (offset.x !== undefined) {
        position.push(parseFloat(line[offset.x]));
        position.push(parseFloat(line[offset.y]));
        position.push(parseFloat(line[offset.z]));
      }
      if (offset.rgb !== undefined) {
        var floatValue = parseFloat(line[offset.rgb]);
        var binaryColor = new Float32Array([floatValue]);
        var dataview = new DataView(binaryColor.buffer, 0);
        color.push(dataview.getUint8(0));
        color.push(dataview.getUint8(1));
        color.push(dataview.getUint8(2));
      }
      if (offset.normal_x !== undefined) {
        normal.push(parseFloat(line[offset.normal_x]));
        normal.push(parseFloat(line[offset.normal_y]));
        normal.push(parseFloat(line[offset.normal_z]));
      }
      if (offset.intensity !== undefined) {
        intensity.push(parseFloat(line[offset.intensity]));
      }
      if (offset.label !== undefined) {
        label.push(parseInt(line[offset.label]));
      }
    }
  }
  return {
    position: position,
    normal: normal,
    color: color
  };
}
function parsePCDBinary(pcdHeader, data) {
  var position = [];
  var normal = [];
  var color = [];
  var intensity = [];
  var label = [];
  var dataview = new DataView(data, pcdHeader.headerLen);
  var offset = pcdHeader.offset;
  for (var i = 0, row = 0; i < pcdHeader.points; i++, row += pcdHeader.rowSize) {
    if (offset.x !== undefined) {
      position.push(dataview.getFloat32(row + offset.x, LITTLE_ENDIAN));
      position.push(dataview.getFloat32(row + offset.y, LITTLE_ENDIAN));
      position.push(dataview.getFloat32(row + offset.z, LITTLE_ENDIAN));
    }
    if (offset.rgb !== undefined) {
      color.push(dataview.getUint8(row + offset.rgb + 0));
      color.push(dataview.getUint8(row + offset.rgb + 1));
      color.push(dataview.getUint8(row + offset.rgb + 2));
    }
    if (offset.normal_x !== undefined) {
      normal.push(dataview.getFloat32(row + offset.normal_x, LITTLE_ENDIAN));
      normal.push(dataview.getFloat32(row + offset.normal_y, LITTLE_ENDIAN));
      normal.push(dataview.getFloat32(row + offset.normal_z, LITTLE_ENDIAN));
    }
    if (offset.intensity !== undefined) {
      intensity.push(dataview.getFloat32(row + offset.intensity, LITTLE_ENDIAN));
    }
    if (offset.label !== undefined) {
      label.push(dataview.getInt32(row + offset.label, LITTLE_ENDIAN));
    }
  }
  return {
    position: position,
    normal: normal,
    color: color,
    intensity: intensity,
    label: label
  };
}

/** Parse compressed PCD data in in binary_compressed form ( https://pointclouds.org/documentation/tutorials/pcd_file_format.html)
 * from https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/PCDLoader.js
 * @license MIT (http://opensource.org/licenses/MIT)
 * @param pcdHeader
 * @param data
 * @returns [attributes]
 */
function parsePCDBinaryCompressed(pcdHeader, data) {
  var position = [];
  var normal = [];
  var color = [];
  var intensity = [];
  var label = [];
  var sizes = new Uint32Array(data.slice(pcdHeader.headerLen, pcdHeader.headerLen + 8));
  var compressedSize = sizes[0];
  var decompressedSize = sizes[1];
  var decompressed = (0, _decompressLzf.decompressLZF)(new Uint8Array(data, pcdHeader.headerLen + 8, compressedSize), decompressedSize);
  var dataview = new DataView(decompressed.buffer);
  var offset = pcdHeader.offset;
  for (var i = 0; i < pcdHeader.points; i++) {
    if (offset.x !== undefined) {
      position.push(dataview.getFloat32(pcdHeader.points * offset.x + pcdHeader.size[0] * i, LITTLE_ENDIAN));
      position.push(dataview.getFloat32(pcdHeader.points * offset.y + pcdHeader.size[1] * i, LITTLE_ENDIAN));
      position.push(dataview.getFloat32(pcdHeader.points * offset.z + pcdHeader.size[2] * i, LITTLE_ENDIAN));
    }
    if (offset.rgb !== undefined) {
      color.push(dataview.getUint8(pcdHeader.points * offset.rgb + pcdHeader.size[3] * i + 0) / 255.0);
      color.push(dataview.getUint8(pcdHeader.points * offset.rgb + pcdHeader.size[3] * i + 1) / 255.0);
      color.push(dataview.getUint8(pcdHeader.points * offset.rgb + pcdHeader.size[3] * i + 2) / 255.0);
    }
    if (offset.normal_x !== undefined) {
      normal.push(dataview.getFloat32(pcdHeader.points * offset.normal_x + pcdHeader.size[4] * i, LITTLE_ENDIAN));
      normal.push(dataview.getFloat32(pcdHeader.points * offset.normal_y + pcdHeader.size[5] * i, LITTLE_ENDIAN));
      normal.push(dataview.getFloat32(pcdHeader.points * offset.normal_z + pcdHeader.size[6] * i, LITTLE_ENDIAN));
    }
    if (offset.intensity !== undefined) {
      var intensityIndex = pcdHeader.fields.indexOf('intensity');
      intensity.push(dataview.getFloat32(pcdHeader.points * offset.intensity + pcdHeader.size[intensityIndex] * i, LITTLE_ENDIAN));
    }
    if (offset.label !== undefined) {
      var labelIndex = pcdHeader.fields.indexOf('label');
      label.push(dataview.getInt32(pcdHeader.points * offset.label + pcdHeader.size[labelIndex] * i, LITTLE_ENDIAN));
    }
  }
  return {
    position: position,
    normal: normal,
    color: color,
    intensity: intensity,
    label: label
  };
}
//# sourceMappingURL=parse-pcd.js.map