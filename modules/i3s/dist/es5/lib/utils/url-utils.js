"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTileAttributeUrls = generateTileAttributeUrls;
exports.generateTilesetAttributeUrls = generateTilesetAttributeUrls;
exports.getUrlWithToken = getUrlWithToken;
function getUrlWithToken(url) {
  var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return token ? "".concat(url, "?token=").concat(token) : url;
}
function generateTileAttributeUrls(url, tile) {
  var _tile$attributeData = tile.attributeData,
    attributeData = _tile$attributeData === void 0 ? [] : _tile$attributeData;
  var attributeUrls = [];
  for (var index = 0; index < attributeData.length; index++) {
    var attributeUrl = attributeData[index].href.replace('./', '');
    attributeUrls.push("".concat(url, "/").concat(attributeUrl));
  }
  return attributeUrls;
}
function generateTilesetAttributeUrls(tileset, resource) {
  var attributeUrls = [];
  var attributeStorageInfo = tileset.attributeStorageInfo,
    url = tileset.url;
  for (var index = 0; index < attributeStorageInfo.length; index++) {
    var fileName = attributeStorageInfo[index].key;
    attributeUrls.push("".concat(url, "/nodes/").concat(resource, "/attributes/").concat(fileName, "/0"));
  }
  return attributeUrls;
}
//# sourceMappingURL=url-utils.js.map