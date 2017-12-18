'use strict';

const MoeditorAction = require('electron').remote.require('./moe-action');

document.addEventListener('DOMContentLoaded', () => {
    const sideMenuButton = document.getElementById('button-bottom-menu');
    const sideMenu = document.getElementById('side-menu');
    const sideMenuCover = document.getElementById('side-menu-cover');
    let clickedButton = null;

    function showMenu() {
        sideMenu.style.marginLeft = '0';
        document.getElementById('main').classList.remove('notransition');
        sideMenuCover.style.opacity = '1';
        sideMenuCover.style.pointerEvents = 'all';
        setTimeout(() => {
            document.getElementById('main').classList.add('notransition');
        }, 200);
    }

    function hideMenu() {
        sideMenu.style.marginLeft = '-300px';
        document.getElementById('main').classList.remove('notransition');
        sideMenuCover.style.opacity = '0';
        sideMenuCover.style.pointerEvents = 'none';
        setTimeout(() => {
            document.getElementById('main').classList.add('notransition');
        }, 200);
    }

    sideMenuCover.addEventListener('click', hideMenu);
    sideMenuButton.addEventListener('click', showMenu);
    sideMenu.addEventListener('transitionend', () => {
        if (clickedButton !== null) {
            setTimeout(clickedButton.itemClicked, 10);
            clickedButton = null;
        }
    });

    const menuItems = sideMenu.querySelectorAll('li:not(.break)');
    for (const e of menuItems) e.addEventListener('click', () => {
        hideMenu();
        clickedButton = e;
    });

    sideMenu.querySelector('li[data-action=new]').itemClicked = (() => {
        MoeditorAction.openNew();
    });

    sideMenu.querySelector('li[data-action=open]').itemClicked = (() => {
        MoeditorAction.open(w.window);
    });

    sideMenu.querySelector('li[data-action=save]').itemClicked = (() => {
        MoeditorAction.save(w.window);
    });

    sideMenu.querySelector('li[data-action=save-as]').itemClicked = (() => {
        MoeditorAction.saveAs(w.window);
    });

    sideMenu.querySelector('li[data-action=export-as-html]').itemClicked = (() => {
        const MoeditorExport = require('./moe-export');
        MoeditorAction.exportAsHTML(w.window, (cb) => {
            MoeditorExport.html(cb);
        });
    });

    sideMenu.querySelector('li[data-action=export-as-pdf]').itemClicked = (() => {
        const MoeditorExport = require('./moe-export');
        MoeditorAction.exportAsPDF(w.window, (cb) => {
            MoeditorExport.pdf(cb);
        });
    });

    sideMenu.querySelector('li[data-action=about]').itemClicked = (() => {
        const ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('show-about-window');
    });

    sideMenu.querySelector('li[data-action=settings]').itemClicked = (() => {
        const ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('show-settings-window');
    });

    sideMenu.querySelector('li[data-action=sample]').itemClicked = (() => {
        const ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('show-sample-window');
    });

    sideMenu.querySelector('li[data-action=book]').itemClicked = (() => {
        const ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.send('show-book-window');
    });
});
