#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldPages = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const createClient_1 = __importDefault(require("../graphql/createClient"));
const getLibraryDir_1 = __importDefault(require("../utils/getLibraryDir"));
const glob_1 = __importDefault(require("glob"));
const query = `
query PageFragments($baseClass: String!, $baseFields: [String!]) {
    generateFragments(baseClass: $baseClass, baseFields: $baseFields) {
        type
        fragment
    }

}
`;
const variables = {
    baseClass: "Page",
    includeBase: true,
    maxNesting: 2,
};
const libraryDir = (0, getLibraryDir_1.default)();
if (!libraryDir) {
    throw new Error(`Could not find package dir at ${__dirname}`);
}
const templatePath = (name) => (path_1.default.join(libraryDir, `templates/${name}.template`));
const scaffoldPages = (ssConfig) => {
    var _a, _b;
    const projectDir = ssConfig.baseDir;
    const ignore = (_b = (_a = ssConfig.page) === null || _a === void 0 ? void 0 : _a.ignore) !== null && _b !== void 0 ? _b : [];
    const absComponentsPath = path_1.default.join(projectDir, `src/templates`);
    let elementalAreaPath;
    if (ssConfig.elemental) {
        const absElementalPath = path_1.default.resolve(absComponentsPath, `../components/elements`);
        fs_1.default.mkdirSync(absElementalPath, { recursive: true });
        const elementalPageSrc = fs_1.default.readFileSync(templatePath(`elementalArea`), { encoding: `utf8` });
        const existing = glob_1.default.sync(`${projectDir}/**/ElementalArea{.tsx,.jsx}`, { absolute: true });
        if (!existing.length) {
            elementalAreaPath = path_1.default.join(absElementalPath, `ElementalArea.tsx`);
            fs_1.default.writeFileSync(elementalAreaPath, elementalPageSrc);
        }
        else {
            console.log(`ElementalArea already exists. Skipping.`);
            elementalAreaPath = existing[0];
        }
    }
    const absPageTemplatePath = templatePath(`page`);
    const absQueryPath = templatePath(`pageQuery`);
    const absElementalPageTemplatePath = templatePath(`elementalPage`);
    const requiredTemplates = [
        absPageTemplatePath,
        absElementalPageTemplatePath,
        absQueryPath,
    ];
    requiredTemplates.forEach((templatePath) => {
        if (!fs_1.default.existsSync(templatePath)) {
            throw new Error(`Template ${templatePath} does not exist`);
        }
    });
    const templateContents = ssConfig.elemental
        ? fs_1.default.readFileSync(absElementalPageTemplatePath, { encoding: `utf8` })
        : fs_1.default.readFileSync(absPageTemplatePath, { encoding: `utf8` });
    const queryContents = fs_1.default.readFileSync(absQueryPath, { encoding: `utf8` });
    const api = (0, createClient_1.default)(ssConfig);
    api.query(query, variables).then(result => {
        result.generateFragments.forEach((result) => {
            if (ignore.includes(result.type)) {
                return;
            }
            const pageDir = path_1.default.join(absComponentsPath, result.type);
            fs_1.default.mkdirSync(pageDir, { recursive: true });
            const componentPath = path_1.default.join(pageDir, `component.tsx`);
            const queryName = `readOne${result.fragment ? result.type : `Page`}`;
            // If no component exists for this block, create it
            if (!fs_1.default.existsSync(componentPath)) {
                let code = templateContents
                    .replace(/<%templateName%>/g, result.type)
                    .replace(/<%queryName%>/g, queryName);
                if (elementalAreaPath) {
                    code = code.replace(/<%elementalAreaPath%>/g, path_1.default.relative(path_1.default.dirname(componentPath), 
                    // remove extension
                    elementalAreaPath.split(`.`).slice(0, -1).join(`.`)));
                }
                fs_1.default.writeFileSync(componentPath, code);
                console.log(`Generated new component for ${result.type}`);
            }
            const target = path_1.default.join(pageDir, `query.graphql`);
            // If the query exists already, don't overwrite it
            if (fs_1.default.existsSync(target)) {
                return;
            }
            if (!result.fragment) {
                return;
            }
            const fields = (0, nextjs_toolkit_1.getFragmentFields)(result.fragment);
            if (!fields) {
                return;
            }
            const query = queryContents
                .replace(/<%queryName%>/g, queryName)
                .replace(/<%operationName%>/g, `${queryName.charAt(0).toUpperCase()}${queryName.slice(1)}`)
                .replace(/<%selectedFields%>/g, fields);
            fs_1.default.writeFileSync(target, query);
            console.log(`Wrote new query for ${result.type}`);
        });
    });
};
exports.scaffoldPages = scaffoldPages;
exports.default = exports.scaffoldPages;
//# sourceMappingURL=scaffoldPages.js.map