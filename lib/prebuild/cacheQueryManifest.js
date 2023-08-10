"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collectors_1 = require("../build/collectors");
const path_1 = require("path");
const write_1 = require("../cache/write");
const getCacheDir_1 = __importDefault(require("../cache/getCacheDir"));
const slash_1 = __importDefault(require("../utils/slash"));
exports.default = async (ssConfig) => {
    const availableQueries = (0, collectors_1.collectQueries)(ssConfig.baseDir);
    const output = [`/** GENERTATED CODE -- DO NOT MODIFY **/`];
    for (const name in availableQueries) {
        const absPath = availableQueries[name];
        const relPath = (0, slash_1.default)((0, path_1.relative)((0, getCacheDir_1.default)(), absPath));
        output.push(`import ${name} from "${relPath}"`);
    }
    output.push(`
    export default {
        ${Object.keys(availableQueries).join(",\n\t")}    
    }
    `);
    (0, write_1.writeFile)(`.queryManifest.js`, output.join("\n"));
    return Promise.resolve();
};
//# sourceMappingURL=cacheQueryManifest.js.map