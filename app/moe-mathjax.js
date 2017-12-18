

'use strict';

var mjAPI = require('mathjax-node/lib/mj-single.js');

mjAPI.config({
    MathJax: {
        // traditional MathJax configuration
    }
});

mjAPI.start();

module.exports = mjAPI;
