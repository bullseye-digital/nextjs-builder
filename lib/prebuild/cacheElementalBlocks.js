"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const write_1 = __importDefault(require("../cache/write"));
const getCacheDir_1 = __importDefault(require("../cache/getCacheDir"));
const collectors_1 = require("../build/collectors");
const slash_1 = __importDefault(require("../utils/slash"));
exports.default = async (ssConfig) => {
    var _a;
    if (!ssConfig.elemental) {
        return Promise.resolve();
    }
    const dir = (_a = ssConfig.elemental.componentsPath) !== null && _a !== void 0 ? _a : `components/elements`;
    const availableBlocks = (0, collectors_1.collectElementalBlocks)(ssConfig.baseDir, dir);
    const output = [`/** GENERTATED CODE -- DO NOT MODIFY **/`];
    output.push(`import dynamic from "next/dynamic"`);
    for (const name in availableBlocks) {
        const absPath = availableBlocks[name];
        const relPath = (0, slash_1.default)((0, path_1.relative)((0, getCacheDir_1.default)(), absPath));
        output.push(`const ${name} = dynamic(() => import('${relPath}'))`);
    }
    output.push(`
    export default {
        ${Object.keys(availableBlocks).join(",\n\t")}    
    }
    `);
    write_1.default.writeFile(`.elementalManifest.js`, output.join("\n"));
    return Promise.resolve();
};
//# sourceMappingURL=cacheElementalBlocks.js.map