"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.loadJSONFile = exports.loadJSON = exports.load = void 0;
/// @ts-ignore
var file_system_cache_1 = __importDefault(require("file-system-cache"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var getProjectDir_1 = __importDefault(require("../utils/getProjectDir"));
var cacheDir = path_1.default.join((_a = (0, getProjectDir_1.default)()) !== null && _a !== void 0 ? _a : "", ".ss-cache");
var createCache = function () { return (0, file_system_cache_1.default)({ basePath: cacheDir }); };
var load = function (key) {
    return createCache().getSync(key);
};
exports.load = load;
var loadJSON = function (key) {
    var result = (0, exports.load)(key);
    if (result) {
        return JSON.parse(result);
    }
    return null;
};
exports.loadJSON = loadJSON;
var loadJSONFile = function (name) {
    var result = (0, exports.readFile)(name);
    if (!result) {
        return null;
    }
    return JSON.parse(result);
};
exports.loadJSONFile = loadJSONFile;
var readFile = function (name) {
    try {
        return fs_1.default.readFileSync("".concat(cacheDir, "/").concat(name), "utf8");
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