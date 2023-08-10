"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const typescript_1 = require("typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const getProjectDir_1 = __importDefault(require("./getProjectDir"));
const bootProjectConfig = () => {
    const projectDir = (0, getProjectDir_1.default)();
    if (!projectDir) {
        throw new Error(`Cannot determine project root from ${__dirname}`);
    }
    const configFilePath = path_1.default.join(projectDir, `ss.config.ts`);
    const tsSource = fs_1.default.readFileSync(configFilePath, { encoding: `utf8` });
    const jsSource = (0, typescript_1.transpileModule)(tsSource, {
        compilerOptions: {
            esModuleInterop: true,
            skipLibCheck: true,
        },
    });
    const envPath = path_1.default.join(projectDir, `.env`);
    dotenv_1.default.config({ path: envPath });
    const ssConfig = eval(jsSource.outputText);
    ssConfig.baseDir = projectDir;
    return ssConfig;
};
exports.default = bootProjectConfig;
//# sourceMappingURL=bootProjectConfig.js.map