'use strict';

const app = require('electron').app,
      MoeditorApplication = require('./moe-app');

var moeApp = null, openFile = null;

app.on("ready", () => {
    moeApp = new MoeditorApplication();
    if (openFile !== null) moeApp.osxOpenFile = openFile;
    global.moeApp = moeApp;
    global.app = app;
    app.moeApp = moeApp;
	moeApp.run();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('open-file', (e, file) => {
    if (moeApp === null) openFile = file;
    else moeApp.open(file);
});

app.on('activate', () => {
    if (moeApp.windows.length == 0) {
        moeApp.open();
    }
});
