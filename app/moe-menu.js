

module.exports = (cb) => {
    let template = [
        {
            localize() { this.label = __('File'); },
            submenu: [
                {
                    localize() { this.label = __('New'); },
                    accelerator: 'Command + N',
                    click(item, w) {
                        cb.fileNew(w);
                    }
                },
                {
                    localize() { this.label = __('Open') + '...'; },
                    accelerator: 'Command + O',
                    click(item, w) {
                        cb.fileOpen(w);
                    }
                },
                {
                    type: 'separator'
                },
                {
                    localize() { this.label = __('Save'); },
                    accelerator: 'Command + S',
                    click(item, w) {
                        cb.fileSave(w);
                    }
                },{
                    localize() { this.label = __('Save as'); },
                    accelerator: 'Command + Option + S',
                    click(item, w) {
                        cb.fileSaveAs(w);
                    }
                },{
                    type: 'separator'
                },{
                    localize() { this.label = __('Export'); },
                    submenu: [
                        {
                            localize() { this.label = 'HTML...'; },
                            accelerator: 'Command + Option + E',
                            click(item, w) {
                                cb.fileExportHTML(w);
                            }
                        }, {
                            localize() { this.label = 'PDF...'; },
                            accelerator: 'Command + Option + P',
                            click(item, w) {
                                cb.fileExportPDF(w);
                            }
                        }
                    ]
                }
            ]
        },
        {
            localize() { this.label = __('Edit'); },
            submenu: [
                {
                    localize() { this.label = __('Undo'); },
                    role: 'undo'
                },
                {
                    localize() { this.label = __('Redo'); },
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    localize() { this.label = __('Cut'); },
                    role: 'cut'
                },
                {
                    localize() { this.label = __('Copy'); },
                    role: 'copy'
                },
                {
                    localize() { this.label = __('Paste'); },
                    role: 'paste'
                },
                {
                    localize() { this.label = __('Delete'); },
                    role: 'delete'
                },
                {
                    localize() { this.label = __('Select All'); },
                    role: 'selectall'
                },
                {
                    type: 'separator'
                },
                {
                    localize() { this.label = __('Mode'); },
                    submenu: [
                        {
                            localize() { this.label = __('Read Mode'); },
                            accelerator: 'Command + Option + R',
                            click(item, focusedWindow) {
                                if (focusedWindow) cb.modeToRead(focusedWindow);
                            }
                        },
                        {
                            localize() { this.label = __('Write Mode'); },
                            accelerator: 'Command + Option + G',
                            click(item, focusedWindow) {
                                if (focusedWindow) cb.modeToWrite(focusedWindow);
                            }
                        },
                        {
                            localize() { this.label = __('Preview Mode'); },
                            // accelerator: 'Command + Option + P', // It's been used for `Export PDF`.
                            click(item, focusedWindow) {
                                if (focusedWindow) cb.modeToPreview(focusedWindow);
                            }
                        }
                    ]
                }
            ]
        },
        {
            localize() { this.label = __('View'); },
            role: 'view',
            submenu: [
                {
                    role: 'togglefullscreen'
                },
            ]
        },
        {
            localize() { this.label = __('Window'); },
            role: 'window',
            submenu: [
                {
                    localize() { this.label = __('Close'); },
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
                {
                    localize() { this.label = __('Minimize'); },
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    localize() { this.label = __('Zoom'); },
                    role: 'zoom'
                },
                {
                    type: 'separator'
                },
                {
                    localize() { this.label = __('Bring All to Front'); },
                    role: 'front'
                }
            ]
        },
        {
            localize() { this.label = __('Help'); },
            role: 'help',
            submenu: [
                {
                    localize() { this.label = 'Prometeus on GitHub'; },
                    click() { require('electron').shell.openExternal('https://github.com/Moeditor/Moeditor'); }
                },
            ]
        },
    ];

    if (process.platform === 'darwin') {
        const name = Const.name;
        template.unshift({
            label: name,
            submenu: [
                {
                    localize() { this.label = __('About') + ' Prometeus'; },
                    click() {
                        cb.about();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    localize() { this.label = __('Preference') + '...'; },
                    accelerator: 'Command + ,',
                    click() {
                        cb.settings();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    role: 'services',
                    localize() { this.label = __('Services'); },
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    localize() { this.label = __('Hide') + ' Prometeus'; },
                    role: 'hide'
                },
                {
                    localize() { this.label = __('Hide Others'); },
                    role: 'hideothers'
                },
                {
                    localize() { this.label = __('Show All'); },
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    localize() { this.label = __('Quit') + ' Prometeus'; },
                    role: 'quit'
                },
            ]
        });
    }

    function localizeMenu(obj) {
        if (obj == null || typeof obj !== 'object') return;
        if (typeof obj.localize === 'function') obj.localize();
        if (Object.getOwnPropertyNames(obj).length > 0) for (const key in obj) localizeMenu(obj[key]);
    }
    localizeMenu(template);

    const {Menu, MenuItem, ipcMain} = require('electron');
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    ipcMain.on('setting-changed', (e, arg) => {
        if (arg.key === 'locale') {
            localizeMenu(template);
            menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu);
        }
    });
};
