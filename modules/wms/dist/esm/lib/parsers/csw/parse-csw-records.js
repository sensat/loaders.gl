import { convertXMLFieldToArrayInPlace } from '@loaders.gl/xml';
import { XMLLoader } from '@loaders.gl/xml';
import { parseExceptionReport } from './parse-exception-report';
export function parseCSWRecords(text, options) {
  var _XMLLoader$parseTextS, _options$xml;
  const parsedXML = (_XMLLoader$parseTextS = XMLLoader.parseTextSync) === null || _XMLLoader$parseTextS === void 0 ? void 0 : _XMLLoader$parseTextS.call(XMLLoader, text, {
    ...options,
    xml: {
      ...(options === null || options === void 0 ? void 0 : options.xml),
      removeNSPrefix: true,
      uncapitalizeKeys: true,
      arrayPaths: [],
      _fastXML: {
        ...(options === null || options === void 0 ? void 0 : (_options$xml = options.xml) === null || _options$xml === void 0 ? void 0 : _options$xml._fastXML),
        parseAttributeValue: true
      }
    }
  });
  parseExceptionReport(parsedXML);
  const xmlRecords = parsedXML.getRecordsResponse;
  const elementSet = xmlRecords.searchResults.elementSet;
  const recordsFieldName = "".concat(elementSet, "Record");
  xmlRecords.records = xmlRecords.searchResults[recordsFieldName];
  delete xmlRecords.searchResults[recordsFieldName];
  convertXMLFieldToArrayInPlace(xmlRecords, 'records');
  for (const record of xmlRecords.records) {
    record.boundingBoxes = record.boundingBox;
    delete record.boundingBox;
    convertXMLFieldToArrayInPlace(record, 'boundingBoxes');
    for (const boundingBox of record.boundingBoxes) {
      boundingBox.value = [boundingBox.upperCorner[0], boundingBox.upperCorner[1], boundingBox.lowerCorner[0], boundingBox.lowerCorner[1]];
      delete boundingBox.upperCorner;
      delete boundingBox.lowerCorner;
    }
  }
  return xmlRecords;
}
export function renameXMLTags(xml, renameKeys) {
  for (const [oldKey, newKey] of Object.entries(renameKeys)) {
    xml[newKey] = xml[oldKey];
    delete xml[oldKey];
  }
}
//# sourceMappingURL=parse-csw-records.js.map