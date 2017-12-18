'use strict';

const {BrowserWindow, ipcMain} = require('electron');

var aboutWindow;

function showAboutWindow() {
    if (typeof aboutWindow !== 'undefined') return;
    const debug = (moeApp.flag.debug | moeApp.config.get('debug')) != 0;
    var conf = {
        icon: Const.path + "/icons/Moeditor.ico",
        autoHideMenuBar: true,
        width: 660 * moeApp.config.get('scale-factor'),
        height: 290 * moeApp.config.get('scale-factor'),
        webPreferences: {
            zoomFactor: moeApp.config.get('scale-factor')
        },
        resizable: false,
        maximizable: false,
        show: debug
    };

    if (process.platform == 'darwin') conf.titleBarStyle = 'hidden-inset';
    else conf.frame = false;

    aboutWindow = new BrowserWindow(conf);
    aboutWindow.loadURL('file://' + Const.path + '/views/about/about.html');
    if (debug) aboutWindow.webContents.openDevTools();
    aboutWindow.webContents.on('close', () => {
        aboutWindow = undefined;
    })
}

ipcMain.on('show-about-window', showAboutWindow);

module.exports = showAboutWindow;
