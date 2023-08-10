"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.loadJSONFile = exports.loadJSON = exports.load = void 0;
/// @ts-ignore
const file_system_cache_1 = __importDefault(require("file-system-cache"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getProjectDir_1 = __importDefault(require("../utils/getProjectDir"));
let cacheDir = path_1.default.join((_a = (0, getProjectDir_1.default)()) !== null && _a !== void 0 ? _a : ``, `.ss-cache`);
const createCache = () => (0, file_system_cache_1.default)({ basePath: cacheDir });
const load = (key) => {
    return createCache().getSync(key);
};
exports.load = load;
const loadJSON = (key) => {
    const result = (0, exports.load)(key);
    if (result) {
        return JSON.parse(result);
    }
    return null;
};
exports.loadJSON = loadJSON;
const loadJSONFile = (name) => {
    const result = (0, exports.readFile)(name);
    if (!result) {
        return null;
    }
    return JSON.parse(result);
};
exports.loadJSONFile = loadJSONFile;
const readFile = (name) => {
    try {
        return fs_1.default.readFileSync(`${cacheDir}/${name}`, `utf8`);
    }
    catch (_) {
        return null;
    }
};
exports.readFile = readFile;
exports.default = {
    load: exports.load,
    loadJSON: exports.loadJSON,
    readFile: exports.readFile,
    loadJSONFile: exports.loadJSONFile,
};
//# sourceMappingURL=read.js.map