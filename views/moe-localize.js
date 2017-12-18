
if (typeof window.localized === 'undefined') window.localized = [];
document.querySelector('html').setAttribute('lang', moeApp.locale.locale);
window.__ = moeApp.locale.get;

function localize() {
    let elements;

    elements = document.getElementsByClassName('l10n') || [];
    for (let e of elements) {
        let text = e.getAttribute('data-origin-text');
        if (!text) {
            if (e.tagName.toUpperCase() === 'OPTION') {
                text = e.text;
            } else {
                text = e.innerText;
            }
            e.setAttribute('data-origin-text', text);
        }

        text = __(text) || text;

        if (e.tagName.toUpperCase() === 'OPTION') {
            e.text = text;
        } else {
            e.innerText = text;
        }
    }

    elements = document.getElementsByClassName('l10n-title') || [];
    for (let e of elements) {
        let title = e.getAttribute('data-origin-title');
        if (!title) {
            title = e.getAttribute('title');
            e.setAttribute('data-origin-title', title);
        }

        title = __(title);

        e.setAttribute('title', title);
    }

    if (window.localized !== []) {
        for (let f of window.localized) f();
        window.localized = [];
    }
};

window.addEventListener('DOMContentLoaded', localize);

require('electron').ipcRenderer.on('setting-changed', (e, arg) => {
    if (arg.key === 'locale') {
        localize();
    }
});
