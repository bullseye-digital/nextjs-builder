#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildManifest = void 0;
const cacheStaticQueries_1 = __importDefault(require("../prebuild/cacheStaticQueries"));
const cacheQueryManifest_1 = __importDefault(require("../prebuild/cacheQueryManifest"));
const cacheTypeAncestry_1 = __importDefault(require("../prebuild/cacheTypeAncestry"));
const cacheTemplateManifest_1 = __importDefault(require("../prebuild/cacheTemplateManifest"));
const cacheGetProps_1 = __importDefault(require("../prebuild/cacheGetProps"));
const cacheElementalBlocks_1 = __importDefault(require("../prebuild/cacheElementalBlocks"));
const createCacheManifest_1 = __importDefault(require("../prebuild/createCacheManifest"));
const glob_1 = require("glob");
const getProjectDir_1 = __importDefault(require("../utils/getProjectDir"));
const path_1 = __importDefault(require("path"));
const write_1 = __importDefault(require("../cache/write"));
const buildManifest = (ssConfig) => {
    const preBuildSteps = [
        cacheStaticQueries_1.default,
        cacheQueryManifest_1.default,
        cacheTypeAncestry_1.default,
        cacheTemplateManifest_1.default,
        cacheGetProps_1.default,
    ];
    if (ssConfig.elemental) {
        preBuildSteps.push(cacheElementalBlocks_1.default);
    }
    const projectDir = (0, getProjectDir_1.default)();
    if (!projectDir) {
        throw new Error(`Could not find project dir at ${__dirname}`);
    }
    write_1.default.clear();
    if (projectDir) {
        glob_1.glob.sync(path_1.default.join(projectDir, `prebuild/*.{js,ts}`), { absolute: true }).forEach(file => {
            preBuildSteps.push(require(file).default);
        });
    }
    const promises = preBuildSteps.map(func => func(ssConfig));
    return Promise.all(promises)
        .then(() => {
        (0, createCacheManifest_1.default)().then(() => {
            console.log(`Prebuild complete`);
        });
    })
        .catch(e => {
        throw new Error(`
Error received while building the manifest:

${e.message}

${e.stack}


        `);
    });
};
exports.buildManifest = buildManifest;
exports.default = exports.buildManifest;
//# sourceMappingURL=buildManifest.js.map