"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var getLibraryDir = function (startDir) {
    if (startDir === void 0) { startDir = null; }
    var packageDir = startDir !== null && startDir !== void 0 ? startDir : __dirname;
    while (!fs_1.default.existsSync(path_1.default.join(packageDir, "package.json"))) {
        packageDir = path_1.default.dirname(packageDir);
    }
    return packageDir;
};
exports.default = getLibraryDir;
//# sourceMappingURL=getLibraryDir.js.map