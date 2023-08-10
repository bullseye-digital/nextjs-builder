"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectElementalBlocks = exports.collectGetProps = exports.collectQueries = exports.collectTemplates = exports.createName = void 0;
// @ts-ignore
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const createName = (absPath) => {
    const match = path_1.default.basename(absPath).match(/^[A-Za-z0-9_]+/);
    if (!match) {
        throw new Error(`Invalid filename ${absPath}`);
    }
    const candidate = match[0];
    if ([`props`, `component`, `query`].includes(candidate)) {
        return path_1.default.basename(path_1.default.dirname(absPath));
    }
    return candidate;
};
exports.createName = createName;
const collectTemplates = (baseDir) => {
    const pattern = path_1.default.join(baseDir, `src/templates/**/*.{js,jsx,ts,tsx}`);
    const nameToPath = {};
    const result = glob_1.default.sync(pattern, { absolute: true });
    result.filter((absPath) => (!absPath.match(/\.props\.(js|ts)$/)) &&
        !absPath.match(/\/props\.(js|ts)$/))
        .forEach((absPath) => {
        nameToPath[(0, exports.createName)(absPath)] = absPath;
    });
    return nameToPath;
};
exports.collectTemplates = collectTemplates;
const collectQueries = (baseDir) => {
    const pattern = path_1.default.join(baseDir, `src/**/*.graphql`);
    const nameToPath = {};
    const result = glob_1.default.sync(pattern, { absolute: true });
    for (const absPath of result) {
        const rel = path_1.default.relative(`${process.cwd()}/src`, absPath);
        if (!rel.startsWith(`fragments`)) {
            nameToPath[(0, exports.createName)(absPath)] = absPath;
        }
    }
    return nameToPath;
};
exports.collectQueries = collectQueries;
const collectGetProps = (baseDir) => {
    const patterns = [
        path_1.default.join(baseDir, `src/**/*.props.{js,ts}`),
        path_1.default.join(baseDir, `src/**/props.{js,ts}`),
    ];
    const nameToPath = {};
    let results = [];
    patterns.forEach(pattern => {
        results = [
            ...results,
            ...glob_1.default.sync(pattern, { absolute: true })
        ];
    });
    for (const absPath of results) {
        const rel = path_1.default.relative(path_1.default.join(baseDir, `src`), absPath);
        if (!rel.startsWith(`fragments`)) {
            nameToPath[(0, exports.createName)(absPath)] = absPath;
        }
    }
    return nameToPath;
};
exports.collectGetProps = collectGetProps;
const collectElementalBlocks = (baseDir, elementalDir) => {
    const pattern = path_1.default.join(baseDir, `src/${elementalDir}/**/*.{js,jsx,ts,tsx}`);
    const nameToPath = {};
    const result = glob_1.default.sync(pattern, { absolute: true });
    result.forEach((absPath) => {
        nameToPath[(0, exports.createName)(absPath)] = absPath;
    });
    return nameToPath;
};
exports.collectElementalBlocks = collectElementalBlocks;
//# sourceMappingURL=collectors.js.map