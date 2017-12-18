'use strict';

const {BrowserWindow, ipcMain} = require('electron');

let settingsWindow;

function showSettingsWindow() {
    if (typeof settingsWindow !== 'undefined') return;
    const debug = (moeApp.flag.debug | moeApp.config.get('debug')) != 0;
    const conf = {
        icon: Const.path + "/icons/Moeditor.ico",
        autoHideMenuBar: true,
        width: 600 * moeApp.config.get('scale-factor'),
        height: parseInt(275 * moeApp.config.get('scale-factor')),
        webPreferences: {
            zoomFactor: moeApp.config.get('scale-factor')
        },
        resizable: false,
        maximizable: false,
        show: debug
    };

    if (process.platform == 'darwin') conf.titleBarStyle = 'hidden-inset';
    else conf.frame = false;

    settingsWindow = new BrowserWindow(conf);
    settingsWindow.loadURL('file://' + Const.path + '/views/settings/settings.html');
    if (debug) settingsWindow.webContents.openDevTools();
    settingsWindow.webContents.on('close', () => {
        settingsWindow = undefined;
    })
}

ipcMain.on('show-settings-window', showSettingsWindow);

module.exports = showSettingsWindow;
