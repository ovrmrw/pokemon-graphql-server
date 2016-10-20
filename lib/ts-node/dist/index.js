/*
    (original)
    ts-node ver.0.9.3
    node_modules/ts-node/dist/index.js
*/

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path_1 = require('path');
var fs_1 = require('fs');
var os_1 = require('os');
var sourceMapSupport = require('source-map-support');
var extend = require('xtend');
var arrify = require('arrify');
var make_error_1 = require('make-error');
var tsconfig = require('tsconfig');
var pkg = require('../package.json');
var oldHandlers = {};
exports.VERSION = pkg.version;
function readConfig(options, cwd, ts) {
    var project = options.project, noProject = options.noProject;
    var fileName = noProject ? undefined : tsconfig.resolveSync(project || cwd);
    var result = fileName ? ts.readConfigFile(fileName, ts.sys.readFile) : {
        config: {
            files: [],
            compilerOptions: {}
        }
    };
    if (result.error) {
        throw new TSError([formatDiagnostic(result.error, ts, cwd)]);
    }
    result.config.compilerOptions = extend({
        /* 
            commentted out in order to enable "allowSyntheticDefaultImports" feature.
        */
        // target: 'es5',
        // module: 'commonjs'
    }, result.config.compilerOptions, options.compilerOptions, {
        sourceMap: false,
        inlineSourceMap: true,
        inlineSources: true,
        declaration: false,
        noEmit: false,
        outDir: "tmp" + Math.random().toString(36).substr(2)
    });
    delete result.config.compilerOptions.out;
    delete result.config.compilerOptions.outFile;
    var basePath = fileName ? path_1.dirname(path_1.resolve(fileName)) : cwd;
    if (typeof ts.parseConfigFile === 'function') {
        return ts.parseConfigFile(result.config, ts.sys, basePath);
    }
    return ts.parseJsonConfigFileContent(result.config, ts.sys, basePath, null, fileName);
}
var DEFAULT_OPTIONS = {
    getFile: getFile,
    getVersion: getVersion,
    getFileExists: getFileExists,
    disableWarnings: process.env.TS_NODE_DISABLE_WARNINGS,
    compiler: process.env.TS_NODE_COMPILER,
    project: process.env.TS_NODE_PROJECT || process.cwd(),
    noProject: process.env.TS_NODE_NO_PROJECT,
    ignoreWarnings: process.env.TS_NODE_IGNORE_WARNINGS,
    fast: process.env.TS_NODE_FAST
};
function register(opts) {
    var cwd = process.cwd();
    var options = extend(DEFAULT_OPTIONS, opts);
    var project = { version: 0, files: {}, versions: {} };
    options.compiler = options.compiler || 'typescript';
    /* 
        commentted out in order to ignore warnings automatically.
    */
    // options.ignoreWarnings = arrify(options.ignoreWarnings).map(Number);
    options.ignoreWarnings = arrify(options.ignoreWarnings).map(Number) || [];
    options.ignoreWarnings.push(2304, 2307);
    
    options.compilerOptions = typeof options.compilerOptions === 'string' ?
        JSON.parse(options.compilerOptions) :
        options.compilerOptions;
    sourceMapSupport.install({
        environment: 'node',
        retrieveFile: function (fileName) {
            if (project.files[fileName]) {
                return getOutput(fileName);
            }
        }
    });
    var ts = require(options.compiler);
    var config = readConfig(options, cwd, ts);
    var diagnostics = formatDiagnostics(config.errors, cwd, ts, options);
    if (diagnostics.length) {
        throw new TSError(diagnostics);
    }
    for (var _i = 0, _a = config.fileNames; _i < _a.length; _i++) {
        var fileName = _a[_i];
        project.files[fileName] = true;
    }
    var getOutput = function (fileName) {
        var contents = options.getFile(fileName);
        var _a = ts.transpileModule(contents, {
            compilerOptions: config.options,
            fileName: fileName,
            reportDiagnostics: true
        }), outputText = _a.outputText, diagnostics = _a.diagnostics;
        var diagnosticList = diagnostics ? formatDiagnostics(diagnostics, cwd, ts, options) : [];
        if (diagnosticList.length) {
            throw new TSError(diagnosticList);
        }
        return outputText;
    };
    var compile = function (fileName) {
        return getOutput(fileName);
    };
    var getTypeInfo = function (fileName, position) {
        throw new TypeError("No type information available under \"--fast\" mode");
    };

    /*
        ADDED
    */
    // console.log('options:');
    // console.log(options);
    // console.log('\n');

    if (!options.fast) {
        var serviceHost = {
            getScriptFileNames: function () { return Object.keys(project.files); },
            getProjectVersion: function () { return String(project.version); },
            getScriptVersion: function (fileName) { return versionFile_1(fileName); },
            getScriptSnapshot: function (fileName) {
                if (!options.getFileExists(fileName)) {
                    return undefined;
                }
                return ts.ScriptSnapshot.fromString(options.getFile(fileName));
            },
            getNewLine: function () { return os_1.EOL; },
            getCurrentDirectory: function () { return cwd; },
            getCompilationSettings: function () { return config.options; },
            getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(config.options); }
        };
        var service_1 = ts.createLanguageService(serviceHost);
        var addAndVersionFile_1 = function (fileName) {
            project.files[fileName] = true;
            var currentVersion = project.versions[fileName];
            var newVersion = versionFile_1(fileName);
            if (currentVersion !== newVersion) {
                project.version++;
            }
            return newVersion;
        };
        var versionFile_1 = function (fileName) {
            var version = options.getVersion(fileName);
            project.versions[fileName] = version;
            return version;
        };
        getOutput = function (fileName) {
            var output = service_1.getEmitOutput(fileName);
            var diagnostics = service_1.getCompilerOptionsDiagnostics()
                .concat(service_1.getSyntacticDiagnostics(fileName))
                .concat(service_1.getSemanticDiagnostics(fileName));
            var diagnosticList = formatDiagnostics(diagnostics, cwd, ts, options);
            if (output.emitSkipped) {
                diagnosticList.push(path_1.relative(cwd, fileName) + ": Emit skipped");
            }
            if (diagnosticList.length) {
                throw new TSError(diagnosticList);
            }
            return output.outputFiles[0].text;
        };
        compile = function (fileName) {
            addAndVersionFile_1(fileName);
            return getOutput(fileName);
        };
        getTypeInfo = function (fileName, position) {
            addAndVersionFile_1(fileName);
            var info = service_1.getQuickInfoAtPosition(fileName, position);
            var name = ts.displayPartsToString(info ? info.displayParts : []);
            var comment = ts.displayPartsToString(info ? info.documentation : []);
            return { name: name, comment: comment };
        };
    }
    function loader(m, fileName) {
        return m._compile(compile(fileName), fileName);
    }
    function shouldIgnore(filename) {
        return path_1.relative(cwd, filename).split(path_1.sep).indexOf('node_modules') > -1;
    }
    function registerExtension(ext) {
        var old = oldHandlers[ext] || oldHandlers['.js'] || require.extensions['.js'];
        oldHandlers[ext] = require.extensions[ext];
        require.extensions[ext] = function (m, filename) {
            if (shouldIgnore(filename)) {
                return old(m, filename);
            }
            return loader(m, filename);
        };
    }
    registerExtension('.ts');
    registerExtension('.tsx');
    if (config.options.allowJs) {
        registerExtension('.js');
    }
    return { compile: compile, getTypeInfo: getTypeInfo };
}
exports.register = register;
function getVersion(fileName) {
    return String(fs_1.statSync(fileName).mtime.getTime());
}
exports.getVersion = getVersion;
function getFileExists(fileName) {
    try {
        var stats = fs_1.statSync(fileName);
        return stats.isFile() || stats.isFIFO();
    }
    catch (err) {
        return false;
    }
}
exports.getFileExists = getFileExists;
function getFile(fileName) {
    return fs_1.readFileSync(fileName, 'utf8');
}
exports.getFile = getFile;
function formatDiagnostics(diagnostics, cwd, ts, options) {
    if (options.disableWarnings) {
        return [];
    }
    return diagnostics
        .filter(function (diagnostic) {
        return options.ignoreWarnings.indexOf(diagnostic.code) === -1;
    })
        .map(function (diagnostic) {
        return formatDiagnostic(diagnostic, ts, cwd);
    });
}
function formatDiagnostic(diagnostic, ts, cwd) {
    var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    if (diagnostic.file) {
        var path = path_1.relative(cwd, diagnostic.file.fileName);
        var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
        return path + " (" + (line + 1) + "," + (character + 1) + "): " + message + " (" + diagnostic.code + ")";
    }
    return message + " (" + diagnostic.code + ")";
}
var TSError = (function (_super) {
    __extends(TSError, _super);
    function TSError(diagnostics) {
        _super.call(this, "\u2A2F Unable to compile TypeScript\n" + diagnostics.join('\n'));
        this.name = 'TSError';
        this.diagnostics = diagnostics;
    }
    return TSError;
}(make_error_1.BaseError));
exports.TSError = TSError;
//# sourceMappingURL=index.js.map