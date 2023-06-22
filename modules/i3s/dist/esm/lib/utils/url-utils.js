export function getUrlWithToken(url) {
  let token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return token ? "".concat(url, "?token=").concat(token) : url;
}
export function generateTileAttributeUrls(url, tile) {
  const {
    attributeData = []
  } = tile;
  const attributeUrls = [];
  for (let index = 0; index < attributeData.length; index++) {
    const attributeUrl = attributeData[index].href.replace('./', '');
    attributeUrls.push("".concat(url, "/").concat(attributeUrl));
  }
  return attributeUrls;
}
export function generateTilesetAttributeUrls(tileset, resource) {
  const attributeUrls = [];
  const {
    attributeStorageInfo,
    url
  } = tileset;
  for (let index = 0; index < attributeStorageInfo.length; index++) {
    const fileName = attributeStorageInfo[index].key;
    attributeUrls.push("".concat(url, "/nodes/").concat(resource, "/attributes/").concat(fileName, "/0"));
  }
  return attributeUrls;
}
//# sourceMappingURL=url-utils.js.map