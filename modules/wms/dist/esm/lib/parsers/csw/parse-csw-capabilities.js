import { XMLLoader } from '@loaders.gl/xml';
import { parseExceptionReport } from './parse-exception-report';
export function parseCSWCapabilities(text, options) {
  var _XMLLoader$parseTextS;
  const parsedXML = (_XMLLoader$parseTextS = XMLLoader.parseTextSync) === null || _XMLLoader$parseTextS === void 0 ? void 0 : _XMLLoader$parseTextS.call(XMLLoader, text, {
    ...options,
    xml: {
      ...(options === null || options === void 0 ? void 0 : options.xml),
      removeNSPrefix: true,
      uncapitalizeKeys: true
    }
  });
  parseExceptionReport(parsedXML);
  const xmlCapabilities = parsedXML.capabilities || parsedXML;
  return xmlCapabilities;
}
//# sourceMappingURL=parse-csw-capabilities.js.map