
'use strict';

const MoeditorWindow = require('./moe-window'),
      MoeditorAction = require('./moe-action'),
      MoeditorFile = require('./moe-file'),
      shortcut = require('electron-localshortcut'),
      MoeditorLocale = require('./moe-l10n'),
      MoeditorAbout = require('./moe-about'),
      MoeditorSettings = require('./moe-settings'),
      MoeditorSample = require('./moe-sample'),
      MoeditorBook = require('./moe-book'),
      path = require('path');

class MoeditorApplication {
	constructor() {
		this.windows = new Array();
        this.newWindow = null;
	}

	open(fileName) {
        if (typeof fileName === 'undefined') {
            this.windows.push(new MoeditorWindow(process.cwd()));
        } else {
            this.windows.push(new MoeditorWindow(fileName));
        }
	}

	run() {
        global.Const = require('./moe-const');

        app.setName(Const.name);

        const Configstore = require('configstore');
        this.config = new Configstore(Const.name, require('./moe-config-default'));
        this.Const = Const;

        this.locale = new MoeditorLocale();
        global.__ = str => this.locale.get(str);

        this.flag = new Object();

        const a = process.argv;
        if (a[0].endsWith('electron') && a[1] == '.') a.shift(), a.shift();
        else a.shift();
        var docs = a.filter((s) => {
            if (s == '--debug') moeApp.flag.debug = true;
            else if (s == '--about') moeApp.flag.about = true;
            else if (s == '--settings') moeApp.flag.settings = true;
            else if (s == '--sample') moeApp.flag.sample = true;
            else if (s == '--book') moeApp.flag.sample = true;

            try {
                return s.substring(0, 2) !== '--' && (MoeditorFile.isTextFile(s) || MoeditorFile.isDirectory(s));
            } catch (e) {
                return false;
            }
        });

        if (moeApp.flag.about) {
            MoeditorAbout();
            return;
        }

        if (moeApp.flag.sample) {
            MoeditorSample();
            return;
        }

        if (moeApp.flag.book) {
            MoeditorBook();
            return;
        }

        if (moeApp.flag.settings) {
            this.listenSettingChanges();
            MoeditorSettings();
            return;
        }

        if (typeof this.osxOpenFile === 'string') docs.push(this.osxOpenFile);

        if (docs.length == 0) this.open();
		else for (var i = 0; i < docs.length; i++) {
            docs[i] = path.resolve(docs[i]);
            this.addRecentDocument(docs[i]);
            this.open(docs[i]);
        }

        if (process.platform === 'darwin') this.registerAppMenu();
        else this.registerShortcuts();

        this.listenSettingChanges();
	}

    registerAppMenu() {
        require('./moe-menu')(
            {
                fileNew: (w) => {
                    MoeditorAction.openNew();
                },
                fileOpen: (w) => {
                    MoeditorAction.open();
                },
                fileSave: (w) => {
                    MoeditorAction.save(w);
                },
                fileSaveAs: (w) => {
                    MoeditorAction.saveAs(w);
                },
                fileExportHTML: (w) => {
                    w.webContents.send('action-export-html');
                },
                fileExportPDF: (w) => {
                    w.webContents.send('action-export-pdf');
                },
                modeToRead: (w) => {
                    w.webContents.send('change-edit-mode', 'read');
                },
                modeToWrite: (w) => {
                    w.webContents.send('change-edit-mode', 'write');
                },
                modeToPreview: (w) => {
                    w.webContents.send('change-edit-mode', 'preview');
                },
                about: (w) => {
                    MoeditorAbout();
                },
                settings: (w) => {
                    MoeditorSettings();
                }
            }
        );
    }

    registerShortcuts() {
        shortcut.register('Ctrl + N', () => {
            MoeditorAction.openNew();
        });

        shortcut.register('Ctrl + O', () => {
            MoeditorAction.open();
        });

        shortcut.register('Ctrl + S', () => {
            MoeditorAction.save();
        });

        shortcut.register('Ctrl + Shift + S', () => {
            MoeditorAction.saveAs();
        });

        shortcut.register('Ctrl + Shift + R', () => {
            let w = require('electron').BrowserWindow.getFocusedWindow();
            if (w) w.webContents.send('change-edit-mode', 'read');
        });

        shortcut.register('Ctrl + Shift + G', () => {
            let w = require('electron').BrowserWindow.getFocusedWindow();
            if (w) w.webContents.send('change-edit-mode', 'write');
        });

        /*
        shortcut.register('Ctrl + Shift + P', () => {
            let w = require('electron').BrowserWindow.getFocusedWindow();
            if (w) w.webContents.send('change-edit-mode', 'preview');
        });
        */
    }

    listenSettingChanges() {
        const ipcMain = require('electron').ipcMain;
        ipcMain.on('setting-changed', (e, arg) => {
            for (const window of require('electron').BrowserWindow.getAllWindows()) {
                window.webContents.send('setting-changed', arg);
            }
        });
    }

    addRecentDocument(path) {
        app.addRecentDocument(path);
    }
}

module.exports = MoeditorApplication;
