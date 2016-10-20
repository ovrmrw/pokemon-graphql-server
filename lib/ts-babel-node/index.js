/*
    (original)
    ts-babel-node ver.1.0.0
    node_modules/ts-babel-node/index.js
*/

'use strict';

var babel = require('babel-core');
var sourceMapSupport = require('source-map-support');

var outputs = {}; // filename => { code, map }

var babelOpts = {
  /* 
      replaced in order to run with ts-node 0.9.3.
  */
  // presets: [ require('babel-preset-es2015') ],
  presets: [ require('babel-preset-latest') ],
  inputSourceMap: true, // load TS source maps
  ast: false,
};

var tsLoader = null;

exports.registerBabel = registerBabel;
function registerBabel() {
  // In case ts-node has already run...
  tsLoader = require.extensions['.ts'];

  Object.defineProperty(require.extensions, '.ts', {
    enumerable: true,

    // In case ts-node hasn't run yet...
    set: function (newTSLoader) {
      tsLoader = newTSLoader;
    },
    get: function () {
      return loadPipeline;
    },
  });

  sourceMapSupport.install({
    handleUncaughtExceptions: false,
    retrieveFile: function (filename) {
      return outputs && outputs[filename] && outputs[filename].code;
    },
    retrieveSourceMap: function (filename) {
      var map = outputs && outputs[filename] && outputs[filename].map;

      if (!map) return null;

      return {
        url: null,
        map: map,
      };
    },

    // In case ts-node has already run...
    overrideRetrieveFile: true,
    overrideRetrieveSourceMap: true,
  });
}

exports.register = register;
function register(opts) {
  registerBabel();

  /* 
      replaced in order to run with ts-node 0.9.3.
  */
  // require('ts-node').register(opts);
  // opts = opts || {};
  // opts.fast = true;
  require('ts-node/dist/index').register(opts);
}

function loadPipeline(m, filename) {
  m._compile(compile(filename), filename);
}

function compile(filename) {
  var tsOutput = mockLoad(tsLoader, filename);
  var babelOutput = babel.transform(tsOutput, babelOpts);

  // babelOutput has a bunch of undocumented stuff on it. Just grab what we need to save memory
  outputs[filename] = { code: babelOutput.code, map: babelOutput.map };

  return babelOutput.code;
}

function mockLoad(loader, filename) {
  var content;
  var module = {
    _compile: function (_content) {
      content = _content;
    },
  };

  loader(module, filename);
  return content;
}
