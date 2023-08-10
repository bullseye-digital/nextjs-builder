"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.clear = exports.writeJSONFile = exports.saveJSON = exports.save = void 0;
/// @ts-ignore
const file_system_cache_1 = __importDefault(require("file-system-cache"));
const fs_1 = __importDefault(require("fs"));
const getCacheDir_1 = __importDefault(require("./getCacheDir"));
const createCache = () => (0, file_system_cache_1.default)({ basePath: (0, getCacheDir_1.default)() });
const save = (key, content) => {
    createCache().setSync(key, content);
};
exports.save = save;
const saveJSON = (key, content) => {
    (0, exports.save)(key, JSON.stringify(content));
};
exports.saveJSON = saveJSON;
const writeJSONFile = (name, content) => {
    (0, exports.writeFile)(name, JSON.stringify(content));
};
exports.writeJSONFile = writeJSONFile;
const clear = async () => {
    fs_1.default.rmSync((0, getCacheDir_1.default)(), { recursive: true, force: true });
    fs_1.default.mkdirSync((0, getCacheDir_1.default)());
};
exports.clear = clear;
const writeFile = (name, content) => {
    fs_1.default.writeFileSync(`${(0, getCacheDir_1.default)()}/${name}`, content, `utf8`);
};
exports.writeFile = writeFile;
exports.default = {
    save: exports.save,
    saveJSON: exports.saveJSON,
    clear: exports.clear,
    writeFile: exports.writeFile,
    writeJSONFile: exports.writeJSONFile,
};
//# sourceMappingURL=write.js.map