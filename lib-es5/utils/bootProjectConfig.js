"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var typescript_1 = require("typescript");
var dotenv_1 = __importDefault(require("dotenv"));
var getProjectDir_1 = __importDefault(require("./getProjectDir"));
var bootProjectConfig = function () {
    var projectDir = (0, getProjectDir_1.default)();
    if (!projectDir) {
        throw new Error("Cannot determine project root from ".concat(__dirname));
    }
    var configFilePath = path_1.default.join(projectDir, "ss.config.ts");
    var tsSource = fs_1.default.readFileSync(configFilePath, { encoding: "utf8" });
    var jsSource = (0, typescript_1.transpileModule)(tsSource, {
        compilerOptions: {
            esModuleInterop: true,
            skipLibCheck: true,
        },
    });
    var envPath = path_1.default.join(projectDir, ".env");
    dotenv_1.default.config({ path: envPath });
    var ssConfig = eval(jsSource.outputText);
    ssConfig.baseDir = projectDir;
    return ssConfig;
};
exports.default = bootProjectConfig;
//# sourceMappingURL=bootProjectConfig.js.map