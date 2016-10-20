#! /usr/bin/env node
/*
    (original)
    ts-babel-node ver.1.0.0
    node_modules/ts-babel-node/bin/ts-babel-node.js
*/

'use strict';

require('..').registerBabel();

/* 
    replaced in order to run with ts-node 0.9.3.
*/
// require('ts-node/dist/bin/ts-node');
require('ts-node/dist/_bin');
