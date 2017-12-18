
'use strict';

if (typeof window._ === 'undefined') window._ = require('lodash');
if (typeof window.Raphael === 'undefined') window.Raphael = require('raphael');

const LRUCache = require('lrucache');
var rendered = LRUCache(1024);

const Flowchart = require('flowchart.js'),
      Sequence = require('js-sequence-diagrams');

var div = document.createElement('div');
div.style.display = 'none';
document.body.appendChild(div);

function renderSequence(str) {
    let diagram = Sequence.parse(str);
    diagram.drawSVG(div, { theme: 'simple' });
    let res = div.innerHTML;
    div.innerHTML = '';
    return `<div>${res}</div>`;
}

function renderFlow(str) {
    let diagram = Flowchart.parse(str);
    diagram.drawSVG(div);
    let res = div.innerHTML;
    div.innerHTML = '';
    return `<div>${res}</div>`;
}

function render(str, type) {
    let res = rendered.get(type + str);
    if (typeof res === 'string') return res;

    try {
        if (type === 'sequence') res = renderSequence(str);
        else if (type === 'flow') res = renderFlow(str);
    } catch(e) {
        res = e;
    }

    rendered.set(type + str, res);
    return res;
}

module.exports = render;
