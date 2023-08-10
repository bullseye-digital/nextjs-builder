"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getProjectDir = () => {
    let dir = __dirname;
    while (dir !== `/`) {
        const candidate = path_1.default.join(dir, `next.config.js`);
        if (fs_1.default.existsSync(candidate)) {
            return dir;
        }
        dir = path_1.default.dirname(dir);
    }
    return null;
};
exports.default = getProjectDir;
//# sourceMappingURL=getProjectDir.js.map