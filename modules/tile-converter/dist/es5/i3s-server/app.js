"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var _require = require('./routes/slpk-router'),
  sceneServerRouter = _require.sceneServerRouter,
  router = _require.router;
var I3S_LAYER_PATH = process.env.I3sLayerPath || '';
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
if (/\.slpk$/.test(I3S_LAYER_PATH)) {
  app.use('/SceneServer/layers/0', router);
  app.use('/SceneServer', sceneServerRouter);
} else {
  app.use('/', indexRouter);
}
module.exports = app;
//# sourceMappingURL=app.js.map