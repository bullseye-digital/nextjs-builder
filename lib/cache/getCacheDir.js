"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getProjectDir_1 = __importDefault(require("../utils/getProjectDir"));
const path_1 = __importDefault(require("path"));
const getCacheDir = () => { var _a; return path_1.default.join((_a = (0, getProjectDir_1.default)()) !== null && _a !== void 0 ? _a : ``, `.ss-cache`); };
exports.default = getCacheDir;
//# sourceMappingURL=getCacheDir.js.map