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
    const availableTemplates = (0, collectors_1.collectTemplates)(ssConfig.baseDir);
    const output = [`/** GENERTATED CODE -- DO NOT MODIFY **/`];
    output.push(`import dynamic from "next/dynamic"`);
    for (const name in availableTemplates) {
        const absPath = availableTemplates[name];
        const relPath = (0, slash_1.default)((0, path_1.relative)((0, getCacheDir_1.default)(), absPath));
        output.push(`const ${name} = dynamic(() => import('${relPath}'))`);
    }
    output.push(`
    export default {
        ${Object.keys(availableTemplates).join(",\n\t")}    
    }
    `);
    (0, write_1.writeFile)(`.templateManifest.js`, output.join("\n"));
    (0, write_1.writeJSONFile)(`.availableTemplates.json`, availableTemplates);
    return Promise.resolve();
};
//# sourceMappingURL=cacheTemplateManifest.js.map