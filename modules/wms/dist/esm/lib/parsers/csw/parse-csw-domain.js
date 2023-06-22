import { XMLLoader } from '@loaders.gl/xml';
import { parseExceptionReport } from './parse-exception-report';
export function parseCSWDomain(text, options) {
  var _XMLLoader$parseTextS;
  const parsedXML = (_XMLLoader$parseTextS = XMLLoader.parseTextSync) === null || _XMLLoader$parseTextS === void 0 ? void 0 : _XMLLoader$parseTextS.call(XMLLoader, text, {
    ...options,
    xml: {
      ...(options === null || options === void 0 ? void 0 : options.xml),
      removeNSPrefix: true,
      uncapitalizeKeys: true,
      arrayPaths: ['GetDomainResponse.DomainValues', 'GetDomainResponse.DomainValues.ListOfValues.value']
    }
  });
  parseExceptionReport(parsedXML);
  const xmlDomain = parsedXML.getDomainResponse;
  for (const domainValue of xmlDomain.domainValues) {
    var _domainValue$listOfVa;
    domainValue.values = (_domainValue$listOfVa = domainValue.listOfValues) === null || _domainValue$listOfVa === void 0 ? void 0 : _domainValue$listOfVa.value;
    delete domainValue.listOfValues;
  }
  return xmlDomain;
}
//# sourceMappingURL=parse-csw-domain.js.map