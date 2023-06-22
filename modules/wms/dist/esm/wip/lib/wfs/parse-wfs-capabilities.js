import { XMLLoader } from '@loaders.gl/xml';
export function parseWFSCapabilities(text, options) {
  var _XMLLoader$parseTextS;
  const parsedXML = (_XMLLoader$parseTextS = XMLLoader.parseTextSync) === null || _XMLLoader$parseTextS === void 0 ? void 0 : _XMLLoader$parseTextS.call(XMLLoader, text, {
    ...options,
    xml: {
      ...(options === null || options === void 0 ? void 0 : options.xml),
      removeNSPrefix: true,
      uncapitalizeKeys: true
    }
  });
  const xmlCapabilities = parsedXML.Capabilities || parsedXML;
  return xmlCapabilities;
}
//# sourceMappingURL=parse-wfs-capabilities.js.map