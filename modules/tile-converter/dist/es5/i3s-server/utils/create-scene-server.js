"use strict";

var _require = require('uuid'),
  uuidv4 = _require.v4;
var createSceneServer = function createSceneServer(name, layer) {
  return {
    serviceItemId: uuidv4().replace(/-/gi, ''),
    serviceName: name,
    name: name,
    currentVersion: '10.7',
    serviceVersion: '1.8',
    supportedBindings: ['REST'],
    layers: [layer]
  };
};
module.exports = createSceneServer;
//# sourceMappingURL=create-scene-server.js.map