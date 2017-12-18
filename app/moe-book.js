'use strict';

const {BrowserWindow, ipcMain} = require('electron');

var bookWindow;

function showBookWindow() {
    if (typeof bookWindow !== 'undefined') return;
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

    bookWindow = new BrowserWindow(conf);
    bookWindow.loadURL('file://' + Const.path + '/views/book/book.html');
    if (debug) bookWindow.webContents.openDevTools();
    bookWindow.webContents.on('close', () => {
        bookWindow = undefined;
    })
}

ipcMain.on('show-book-window', showBookWindow);

module.exports = showBookWindow;
