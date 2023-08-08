"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getLibraryDir = (startDir = null) => {
    let packageDir = startDir !== null && startDir !== void 0 ? startDir : __dirname;
    while (!fs_1.default.existsSync(path_1.default.join(packageDir, `package.json`))) {
        packageDir = path_1.default.dirname(packageDir);
    }
    return packageDir;
};
exports.default = getLibraryDir;
//# sourceMappingURL=getLibraryDir.js.map