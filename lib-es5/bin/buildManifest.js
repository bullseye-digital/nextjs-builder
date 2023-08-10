#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildManifest = void 0;
var cacheStaticQueries_1 = __importDefault(require("../prebuild/cacheStaticQueries"));
var cacheQueryManifest_1 = __importDefault(require("../prebuild/cacheQueryManifest"));
var cacheTypeAncestry_1 = __importDefault(require("../prebuild/cacheTypeAncestry"));
var cacheTemplateManifest_1 = __importDefault(require("../prebuild/cacheTemplateManifest"));
var cacheGetProps_1 = __importDefault(require("../prebuild/cacheGetProps"));
var cacheElementalBlocks_1 = __importDefault(require("../prebuild/cacheElementalBlocks"));
var createCacheManifest_1 = __importDefault(require("../prebuild/createCacheManifest"));
var glob_1 = require("glob");
var getProjectDir_1 = __importDefault(require("../utils/getProjectDir"));
var path_1 = __importDefault(require("path"));
var write_1 = __importDefault(require("../cache/write"));
var buildManifest = function (ssConfig) {
    var preBuildSteps = [
        cacheStaticQueries_1.default,
        cacheQueryManifest_1.default,
        cacheTypeAncestry_1.default,
        cacheTemplateManifest_1.default,
        cacheGetProps_1.default,
    ];
    if (ssConfig.elemental) {
        preBuildSteps.push(cacheElementalBlocks_1.default);
    }
    var projectDir = (0, getProjectDir_1.default)();
    if (!projectDir) {
        throw new Error("Could not find project dir at ".concat(__dirname));
    }
    write_1.default.clear();
    if (projectDir) {
        glob_1.glob.sync(path_1.default.join(projectDir, "prebuild/*.{js,ts}"), { absolute: true }).forEach(function (file) {
            preBuildSteps.push(require(file).default);
        });
    }
    var promises = preBuildSteps.map(function (func) { return func(ssConfig); });
    return Promise.all(promises)
        .then(function () {
        (0, createCacheManifest_1.default)().then(function () {
            console.log("Prebuild complete");
        });
    })
        .catch(function (e) {
        throw new Error("\nError received while building the manifest:\n\n".concat(e.message, "\n\n").concat(e.stack, "\n\n\n        "));
    });
};
exports.buildManifest = buildManifest;
exports.default = exports.buildManifest;
//# sourceMappingURL=buildManifest.js.map