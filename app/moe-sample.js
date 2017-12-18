'use strict';

const {BrowserWindow, ipcMain} = require('electron');

var sampleWindow;

function showSampleWindow() {
    if (typeof sampleWindow !== 'undefined') return;
    const debug = (moeApp.flag.debug | moeApp.config.get('debug')) != 0;
    var conf = {
        icon: Const.path + "/icons/Moeditor.ico",
        autoHideMenuBar: true,
        width: 660 * moeApp.config.get('scale-factor'),
        height: 590 * moeApp.config.get('scale-factor'),
        webPreferences: {
            zoomFactor: moeApp.config.get('scale-factor')
        },
        resizable: false,
        maximizable: false,
        show: debug
    };

    if (process.platform == 'darwin') conf.titleBarStyle = 'hidden-inset';
    else conf.frame = false;

    sampleWindow = new BrowserWindow(conf);
    sampleWindow.loadURL('file://' + Const.path + '/views/sample/sample.html');
    if (debug) sampleWindow.webContents.openDevTools();
    sampleWindow.webContents.on('close', () => {
        sampleWindow = undefined;
    })
}

ipcMain.on('show-sample-window', showSampleWindow);

module.exports = showSampleWindow;
