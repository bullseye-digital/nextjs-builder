#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldBlocks = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createClient_1 = __importDefault(require("../graphql/createClient"));
const getLibraryDir_1 = __importDefault(require("../utils/getLibraryDir"));
const query = `
query BlockFragments($baseClass: String!, $baseFields: [String!]) {
    generateFragments(baseClass: $baseClass, baseFields: $baseFields) {
        type
        fragment
    }

}
`;
const variables = {
    baseClass: "DNADesign\\Elemental\\Models\\BaseElement",
    includeBase: true,
};
const libraryDir = (0, getLibraryDir_1.default)();
if (!libraryDir) {
    throw new Error(`Could not find package dir at ${__dirname}`);
}
const scaffoldBlocks = (ssConfig) => {
    var _a, _b, _c, _d;
    const projectDir = ssConfig.baseDir;
    const elementalFragmentPath = (_b = (_a = ssConfig.elemental) === null || _a === void 0 ? void 0 : _a.fragmentsPath) !== null && _b !== void 0 ? _b : `fragments/elemental/elements`;
    const elementalComponentsPath = (_d = (_c = ssConfig.elemental) === null || _c === void 0 ? void 0 : _c.componentsPath) !== null && _d !== void 0 ? _d : `components/elemental`;
    const absFragmentsPath = path_1.default.join(projectDir, `src/fragments`);
    const absElementalFragmentsPath = path_1.default.join(projectDir, `src/${elementalFragmentPath}`);
    const absElementalComponentsPath = path_1.default.join(projectDir, `src/${elementalComponentsPath}`);
    const fragmentTemplatePath = path_1.default.join(libraryDir, `templates/elements.template`);
    if (!fs_1.default.existsSync(fragmentTemplatePath)) {
        throw new Error(`Template ${fragmentTemplatePath} does not exist`);
    }
    const fragmentTemplateContents = fs_1.default.readFileSync(fragmentTemplatePath, {
        encoding: `utf8`,
    });
    const componentTemplatePath = path_1.default.join(libraryDir, `templates/block.template`);
    if (!fs_1.default.existsSync(componentTemplatePath)) {
        throw new Error(`Template ${componentTemplatePath} does not exist`);
    }
    const componentTemplateContents = fs_1.default.readFileSync(componentTemplatePath, {
        encoding: `utf8`,
    });
    const api = (0, createClient_1.default)(ssConfig);
    api.query(query, variables).then(result => {
        const baseElement = result.generateFragments.filter((r) => r.type === `BaseElement`);
        if (!baseElement) {
            throw new Error(`No BaseElement type could be found. Perhaps you're using a custom type name?`);
        }
        fs_1.default.mkdirSync(absElementalFragmentsPath, { recursive: true });
        fs_1.default.mkdirSync(absElementalComponentsPath, { recursive: true });
        const baseFieldsPath = path_1.default.relative(absElementalFragmentsPath, `${absFragmentsPath}/BaseFields.graphql`);
        const imports = [`#import "${baseFieldsPath}"`];
        const inlineFragments = [`\t...BaseFields`];
        result.generateFragments.forEach((result) => {
            const isBase = result.type === `BaseElement`;
            const componentPath = path_1.default.join(absElementalComponentsPath, `${result.type}.tsx`);
            // If no component exists for this block, create it
            if (!isBase && !fs_1.default.existsSync(componentPath)) {
                const code = componentTemplateContents
                    .replace(/<%typeName%>/g, result.type);
                fs_1.default.writeFileSync(componentPath, code);
                console.log(`Generated new component for ${result.type}`);
            }
            // Some blocks have no unique fields. Skip the fragment generation.
            if (!result.fragment) {
                console.log(`${result.type} has no unique fields. Skipping fragment generation.`);
                return;
            }
            const basename = `${result.type}Fields.graphql`;
            const target = path_1.default.join(absElementalFragmentsPath, basename);
            // Build up a list of required imports and fragments for the all-inclusive _elements.graphql
            imports.push(`#import "./${result.type}Fields.graphql"`);
            if (isBase) {
                inlineFragments.push(`\t...${result.type}Fields`);
            }
            else {
                inlineFragments.push(`
    ... on ${result.type} {
        ...${result.type}Fields
    }`);
            }
            // If the query exists already, don't overwrite it
            if (fs_1.default.existsSync(target)) {
                return;
            }
            fs_1.default.writeFileSync(target, result.fragment);
            console.log(`Wrote new query for ${result.type}`);
        });
        const absElementsPath = path_1.default.join(absElementalFragmentsPath, `_elements.graphql`);
        let needsRegeneration = false;
        if (!fs_1.default.existsSync(absElementsPath)) {
            needsRegeneration = true;
        }
        else {
            const contents = fs_1.default.readFileSync(absElementsPath, { encoding: `utf8` });
            if (contents && contents.startsWith(`###--`)) {
                needsRegeneration = true;
            }
        }
        if (needsRegeneration) {
            const generated = fragmentTemplateContents
                .replace(/<%imports%>/g, imports.join("\n"))
                .replace(/<%elements%>/g, inlineFragments.join("\n"));
            fs_1.default.writeFileSync(absElementsPath, generated);
            console.log(`Regenerated _elements.graphql file`);
        }
        else {
            console.log(`_elements.graphql file has been customised. Skipping regeneration.`);
        }
    });
};
exports.scaffoldBlocks = scaffoldBlocks;
//# sourceMappingURL=scaffoldBlocks.js.map