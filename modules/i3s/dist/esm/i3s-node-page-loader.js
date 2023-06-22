const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
async function parseNodePage(data, options) {
  return JSON.parse(new TextDecoder().decode(data));
}
export const I3SNodePageLoader = {
  name: 'I3S Node Page',
  id: 'i3s-node-page',
  module: 'i3s',
  version: VERSION,
  mimeTypes: ['application/json'],
  parse: parseNodePage,
  extensions: ['json'],
  options: {}
};
//# sourceMappingURL=i3s-node-page-loader.js.map