"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path_1 = require("path");
const write_1 = require("../cache/write");
const getCacheDir_1 = __importDefault(require("../cache/getCacheDir"));
exports.default = async () => {
    const output = [
        `/** GENERTATED CODE -- DO NOT MODIFY **/`,
        ``,
    ];
    const vars = [];
    const cacheFiles = glob_1.glob.sync(`${(0, getCacheDir_1.default)()}/{*.js,*.json}`, {
        dot: true,
    });
    cacheFiles.forEach(absPath => {
        const base = (0, path_1.basename)(absPath);
        const canonicalName = base.match(/^\.([A-Za-z_-]+)/);
        if (!canonicalName) {
            return;
        }
        const varName = canonicalName[1];
        output.push(`import ${varName} from "./${base}"`);
        vars.push(varName);
    });
    output.push(``);
    output.push(`export default {`);
    output.push(vars.join(",\n"));
    output.push(`}`);
    (0, write_1.writeFile)(`index.js`, output.join("\n"));
    return Promise.resolve();
};
//# sourceMappingURL=createCacheManifest.js.map