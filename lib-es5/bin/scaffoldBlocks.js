#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldBlocks = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var createClient_1 = __importDefault(require("../graphql/createClient"));
var getLibraryDir_1 = __importDefault(require("../utils/getLibraryDir"));
var query = "\nquery BlockFragments($baseClass: String!, $baseFields: [String!]) {\n    generateFragments(baseClass: $baseClass, baseFields: $baseFields) {\n        type\n        fragment\n    }\n\n}\n";
var variables = {
    baseClass: "DNADesign\\Elemental\\Models\\BaseElement",
    includeBase: true,
};
var libraryDir = (0, getLibraryDir_1.default)();
if (!libraryDir) {
    throw new Error("Could not find package dir at ".concat(__dirname));
}
var scaffoldBlocks = function (ssConfig) {
    var _a, _b, _c, _d;
    var projectDir = ssConfig.baseDir;
    var elementalFragmentPath = (_b = (_a = ssConfig.elemental) === null || _a === void 0 ? void 0 : _a.fragmentsPath) !== null && _b !== void 0 ? _b : "fragments/elemental/elements";
    var elementalComponentsPath = (_d = (_c = ssConfig.elemental) === null || _c === void 0 ? void 0 : _c.componentsPath) !== null && _d !== void 0 ? _d : "components/elemental";
    var absFragmentsPath = path_1.default.join(projectDir, "src/fragments");
    var absElementalFragmentsPath = path_1.default.join(projectDir, "src/".concat(elementalFragmentPath));
    var absElementalComponentsPath = path_1.default.join(projectDir, "src/".concat(elementalComponentsPath));
    var fragmentTemplatePath = path_1.default.join(libraryDir, "templates/elements.template");
    if (!fs_1.default.existsSync(fragmentTemplatePath)) {
        throw new Error("Template ".concat(fragmentTemplatePath, " does not exist"));
    }
    var fragmentTemplateContents = fs_1.default.readFileSync(fragmentTemplatePath, {
        encoding: "utf8",
    });
    var componentTemplatePath = path_1.default.join(libraryDir, "templates/block.template");
    if (!fs_1.default.existsSync(componentTemplatePath)) {
        throw new Error("Template ".concat(componentTemplatePath, " does not exist"));
    }
    var componentTemplateContents = fs_1.default.readFileSync(componentTemplatePath, {
        encoding: "utf8",
    });
    var api = (0, createClient_1.default)(ssConfig);
    api.query(query, variables).then(function (result) {
        var baseElement = result.generateFragments.filter(function (r) { return r.type === "BaseElement"; });
        if (!baseElement) {
            throw new Error("No BaseElement type could be found. Perhaps you're using a custom type name?");
        }
        fs_1.default.mkdirSync(absElementalFragmentsPath, { recursive: true });
        fs_1.default.mkdirSync(absElementalComponentsPath, { recursive: true });
        var baseFieldsPath = path_1.default.relative(absElementalFragmentsPath, "".concat(absFragmentsPath, "/BaseFields.graphql"));
        var imports = ["#import \"".concat(baseFieldsPath, "\"")];
        var inlineFragments = ["\t...BaseFields"];
        result.generateFragments.forEach(function (result) {
            var isBase = result.type === "BaseElement";
            var componentPath = path_1.default.join(absElementalComponentsPath, "".concat(result.type, ".tsx"));
            // If no component exists for this block, create it
            if (!isBase && !fs_1.default.existsSync(componentPath)) {
                var code = componentTemplateContents
                    .replace(/<%typeName%>/g, result.type);
                fs_1.default.writeFileSync(componentPath, code);
                console.log("Generated new component for ".concat(result.type));
            }
            // Some blocks have no unique fields. Skip the fragment generation.
            if (!result.fragment) {
                console.log("".concat(result.type, " has no unique fields. Skipping fragment generation."));
                return;
            }
            var basename = "".concat(result.type, "Fields.graphql");
            var target = path_1.default.join(absElementalFragmentsPath, basename);
            // Build up a list of required imports and fragments for the all-inclusive _elements.graphql
            imports.push("#import \"./".concat(result.type, "Fields.graphql\""));
            if (isBase) {
                inlineFragments.push("\t...".concat(result.type, "Fields"));
            }
            else {
                inlineFragments.push("\n    ... on ".concat(result.type, " {\n        ...").concat(result.type, "Fields\n    }"));
            }
            // If the query exists already, don't overwrite it
            if (fs_1.default.existsSync(target)) {
                return;
            }
            fs_1.default.writeFileSync(target, result.fragment);
            console.log("Wrote new query for ".concat(result.type));
        });
        var absElementsPath = path_1.default.join(absElementalFragmentsPath, "_elements.graphql");
        var needsRegeneration = false;
        if (!fs_1.default.existsSync(absElementsPath)) {
            needsRegeneration = true;
        }
        else {
            var contents = fs_1.default.readFileSync(absElementsPath, { encoding: "utf8" });
            if (contents && contents.startsWith("###--")) {
                needsRegeneration = true;
            }
        }
        if (needsRegeneration) {
            var generated = fragmentTemplateContents
                .replace(/<%imports%>/g, imports.join("\n"))
                .replace(/<%elements%>/g, inlineFragments.join("\n"));
            fs_1.default.writeFileSync(absElementsPath, generated);
            console.log("Regenerated _elements.graphql file");
        }
        else {
            console.log("_elements.graphql file has been customised. Skipping regeneration.");
        }
    });
};
exports.scaffoldBlocks = scaffoldBlocks;
//# sourceMappingURL=scaffoldBlocks.js.map