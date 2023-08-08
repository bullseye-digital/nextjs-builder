"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collectors_1 = require("../build/collectors");
const path_1 = require("path");
const write_1 = __importDefault(require("../cache/write"));
const getCacheDir_1 = __importDefault(require("../cache/getCacheDir"));
exports.default = async (ssConfig) => {
    const availableFuncs = (0, collectors_1.collectGetProps)(ssConfig.baseDir);
    const output = [`/** GENERTATED CODE -- DO NOT MODIFY **/`];
    for (const name in availableFuncs) {
        const absPath = availableFuncs[name];
        const relPath = (0, path_1.relative)((0, getCacheDir_1.default)(), absPath);
        output.push(`import ${name} from "${relPath}"`);
    }
    output.push(`
    export default {
        ${Object.keys(availableFuncs).join(",\n\t")}    
    }
    `);
    write_1.default.writeFile(`.getPropsManifest.js`, output.join("\n"));
    return Promise.resolve();
};
//# sourceMappingURL=cacheGetProps.js.map