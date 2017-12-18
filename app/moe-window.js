'use strict';

const BrowserWindow = require('electron').BrowserWindow,
      dialog = require('electron').dialog,
      MoeditorAction = require('./moe-action'),
      MoeditorFile = require('./moe-file');

class MoeditorWindow {
	constructor(path) {
        moeApp.newWindow = this;

        if (MoeditorFile.isDirectory(path)) {
            this.directory = path
            this.fileName = '';
            this.fileContent = this.content = '';
        } else {
            this.directory = require('path').dirname(path);
            this.fileName = path;
            this.fileContent = this.content = MoeditorFile.read(path).toString();
        }

        this.changed = false;
        const debug = (moeApp.flag.debug | moeApp.config.get('debug')) != 0;
        var conf = {
            icon: Const.path + "/icons/Moeditor.ico",
            autoHideMenuBar: true,
            width: 1000 * moeApp.config.get('scale-factor'),
            height: 1000 * moeApp.config.get('scale-factor'),
            webPreferences: {
                zoomFactor: moeApp.config.get('scale-factor')
            },
			show: debug
        };

        if (process.platform == 'darwin') conf.titleBarStyle = 'hidden-inset';
        else conf.frame = false;

		this.window = new BrowserWindow(conf);
        this.window.moeditorWindow = this;

        this.registerEvents();
        this.window.loadURL('file://' + Const.path + '/views/main/index.html');

        if (debug) {
            this.window.webContents.openDevTools();
        }
	}

    registerEvents() {
        this.window.on('close', (e) => {
            if (this.changed) {
                const choice = dialog.showMessageBox(
                    this.window,
                    {
                        type: 'question',
                        buttons: [__("Yes"), __("No"), __("Cancel")],
                        title: __("Confirm"),
                        message: __("Save changes to file?")
                    }
                );

                if (choice == 0) {
                    if (!MoeditorAction.save(this.window)) e.preventDefault();
                } else if (choice == 2) e.preventDefault();
            }

            const index = moeApp.windows.indexOf(this);
            if (index !== -1) moeApp.windows.splice(index, 1);
        });
    }
}

module.exports = MoeditorWindow;
