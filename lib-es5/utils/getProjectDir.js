"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var getProjectDir = function () {
    var dir = __dirname;
    while (dir !== "/") {
        var candidate = path_1.default.join(dir, "next.config.js");
        if (fs_1.default.existsSync(candidate)) {
            return dir;
        }
        dir = path_1.default.dirname(dir);
    }
    return null;
};
exports.default = getProjectDir;
//# sourceMappingURL=getProjectDir.js.map