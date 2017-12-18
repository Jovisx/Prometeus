'use strict';

const {BrowserWindow, ipcMain, shell} = require('electron');
const os = require('os');
const path = require('path');
const MoeditorFile = require('./moe-file');
var workerWindow, fileName, tmp, errorHandler;

function exportPDF(content, cb) {
    workerWindow = new BrowserWindow({ show: false });

    function randString(n) {
        function rand(l, r) {
            return Math.floor(Math.random() * 100000000) % (r - l + 1) + l;
        }

        var s = '';
        for (var i = 0; i < n; i++) {
            var r = rand(1, 3);
            if (r == 1) s += String.fromCharCode(rand('0'.charCodeAt(0), '9'.charCodeAt(0)));
            else if (r == 2) s += String.fromCharCode(rand('a'.charCodeAt(0), 'z'.charCodeAt(0)));
            else if (r == 3) s += String.fromCharCode(rand('A'.charCodeAt(0), 'Z'.charCodeAt(0)));
        }

        return s;
    }

    tmp = path.join(os.tmpdir(), 'Moeditor-export-' + randString(10) + '.html');
    MoeditorFile.write(tmp, content.s);
    fileName = content.path;
    errorHandler = cb;

    workerWindow.loadURL('file://' + tmp);
    // workerWindow.webContents.openDevTools();
}

ipcMain.on('ready-export-pdf', (event) => {
    setTimeout(() => {
        workerWindow.webContents.printToPDF({
            printBackground: true
        }, (error, data) => {
            MoeditorFile.writeAsync(fileName, data, (error) => {
                if (error) errorHandler(error);
                else {
                    shell.openItem(fileName);
                    workerWindow.destroy();
                    workerWindow = undefined;
                    MoeditorFile.remove(tmp);
                }
            })
        })
    }, 1000);
});

module.exports = exportPDF;
