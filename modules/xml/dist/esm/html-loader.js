import { mergeLoaderOptions } from '@loaders.gl/loader-utils';
import { XMLLoader } from './xml-loader';
export const HTMLLoader = {
  ...XMLLoader,
  name: 'HTML',
  id: 'html',
  extensions: ['html', 'htm'],
  mimeTypes: ['text/html'],
  testText: testHTMLFile,
  parse: async (arrayBuffer, options) => parseTextSync(new TextDecoder().decode(arrayBuffer), options),
  parseTextSync: (text, options) => parseTextSync(text, options)
};
function testHTMLFile(text) {
  return text.startsWith('<html');
}
function parseTextSync(text, options) {
  var _XMLLoader$parseTextS;
  options = mergeLoaderOptions(options, {
    xml: {
      _parser: 'fast-xml-parser',
      _fastXML: {
        htmlEntities: true
      }
    }
  });
  return (_XMLLoader$parseTextS = XMLLoader.parseTextSync) === null || _XMLLoader$parseTextS === void 0 ? void 0 : _XMLLoader$parseTextS.call(XMLLoader, text, options);
}
//# sourceMappingURL=html-loader.js.map