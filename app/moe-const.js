'use strict';

const app = require('electron').app,
      pkg = require('../package.json'),
      appPath = app.getAppPath();

module.exports = {
    name: "Moeditor",
    path: appPath
};
