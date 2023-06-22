"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseWMSFeatureInfo = parseWMSFeatureInfo;
var _xml = require("@loaders.gl/xml");
function parseWMSFeatureInfo(text, options) {
  var _XMLLoader$parseTextS, _parsedXML$FeatureInf;
  var parsedXML = (_XMLLoader$parseTextS = _xml.XMLLoader.parseTextSync) === null || _XMLLoader$parseTextS === void 0 ? void 0 : _XMLLoader$parseTextS.call(_xml.XMLLoader, text, options);
  var xmlFeatureInfo = ((_parsedXML$FeatureInf = parsedXML.FeatureInfoResponse) === null || _parsedXML$FeatureInf === void 0 ? void 0 : _parsedXML$FeatureInf.FIELDS) || [];
  var xmlFeatures = Array.isArray(xmlFeatureInfo) ? xmlFeatureInfo : [xmlFeatureInfo];
  return {
    features: xmlFeatures.map(function (xmlFeature) {
      return extractFeature(xmlFeature);
    })
  };
}
function extractFeature(xmlFeature) {
  var xmlFields = xmlFeature || {};
  return {
    attributes: xmlFields,
    type: '',
    bounds: {
      bottom: 0,
      top: 0,
      left: 0,
      right: 0
    }
  };
}
//# sourceMappingURL=parse-wms-features.js.map