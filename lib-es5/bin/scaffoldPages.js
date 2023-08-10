#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldPages = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var createClient_1 = __importDefault(require("../graphql/createClient"));
var getLibraryDir_1 = __importDefault(require("../utils/getLibraryDir"));
var glob_1 = __importDefault(require("glob"));
var query = "\nquery PageFragments($baseClass: String!, $baseFields: [String!]) {\n    generateFragments(baseClass: $baseClass, baseFields: $baseFields) {\n        type\n        fragment\n    }\n\n}\n";
var variables = {
    baseClass: "Page",
    includeBase: true,
    maxNesting: 2,
};
var libraryDir = (0, getLibraryDir_1.default)();
if (!libraryDir) {
    throw new Error("Could not find package dir at ".concat(__dirname));
}
var templatePath = function (name) { return (path_1.default.join(libraryDir, "templates/".concat(name, ".template"))); };
var scaffoldPages = function (ssConfig) {
    var _a, _b;
    var projectDir = ssConfig.baseDir;
    var ignore = (_b = (_a = ssConfig.page) === null || _a === void 0 ? void 0 : _a.ignore) !== null && _b !== void 0 ? _b : [];
    var absComponentsPath = path_1.default.join(projectDir, "src/templates");
    var elementalAreaPath;
    if (ssConfig.elemental) {
        var absElementalPath = path_1.default.resolve(absComponentsPath, "../components/elements");
        fs_1.default.mkdirSync(absElementalPath, { recursive: true });
        var elementalPageSrc = fs_1.default.readFileSync(templatePath("elementalArea"), { encoding: "utf8" });
        var existing = glob_1.default.sync("".concat(projectDir, "/**/ElementalArea{.tsx,.jsx}"), { absolute: true });
        if (!existing.length) {
            elementalAreaPath = path_1.default.join(absElementalPath, "ElementalArea.tsx");
            fs_1.default.writeFileSync(elementalAreaPath, elementalPageSrc);
        }
        else {
            console.log("ElementalArea already exists. Skipping.");
            elementalAreaPath = existing[0];
        }
    }
    var absPageTemplatePath = templatePath("page");
    var absQueryPath = templatePath("pageQuery");
    var absElementalPageTemplatePath = templatePath("elementalPage");
    var requiredTemplates = [
        absPageTemplatePath,
        absElementalPageTemplatePath,
        absQueryPath,
    ];
    requiredTemplates.forEach(function (templatePath) {
        if (!fs_1.default.existsSync(templatePath)) {
            throw new Error("Template ".concat(templatePath, " does not exist"));
        }
    });
    var templateContents = ssConfig.elemental
        ? fs_1.default.readFileSync(absElementalPageTemplatePath, { encoding: "utf8" })
        : fs_1.default.readFileSync(absPageTemplatePath, { encoding: "utf8" });
    var queryContents = fs_1.default.readFileSync(absQueryPath, { encoding: "utf8" });
    var api = (0, createClient_1.default)(ssConfig);
    api.query(query, variables).then(function (result) {
        result.generateFragments.forEach(function (result) {
            if (ignore.includes(result.type)) {
                return;
            }
            var pageDir = path_1.default.join(absComponentsPath, result.type);
            fs_1.default.mkdirSync(pageDir, { recursive: true });
            var componentPath = path_1.default.join(pageDir, "component.tsx");
            var queryName = "readOne".concat(result.fragment ? result.type : "Page");
            // If no component exists for this block, create it
            if (!fs_1.default.existsSync(componentPath)) {
                var code = templateContents
                    .replace(/<%templateName%>/g, result.type)
                    .replace(/<%queryName%>/g, queryName);
                if (elementalAreaPath) {
                    code = code.replace(/<%elementalAreaPath%>/g, path_1.default.relative(path_1.default.dirname(componentPath), 
                    // remove extension
                    elementalAreaPath.split(".").slice(0, -1).join(".")));
                }
                fs_1.default.writeFileSync(componentPath, code);
                console.log("Generated new component for ".concat(result.type));
            }
            var target = path_1.default.join(pageDir, "query.graphql");
            // If the query exists already, don't overwrite it
            if (fs_1.default.existsSync(target)) {
                return;
            }
            if (!result.fragment) {
                return;
            }
            var fields = (0, nextjs_toolkit_1.getFragmentFields)(result.fragment);
            if (!fields) {
                return;
            }
            var query = queryContents
                .replace(/<%queryName%>/g, queryName)
                .replace(/<%operationName%>/g, "".concat(queryName.charAt(0).toUpperCase()).concat(queryName.slice(1)))
                .replace(/<%selectedFields%>/g, fields);
            fs_1.default.writeFileSync(target, query);
            console.log("Wrote new query for ".concat(result.type));
        });
    });
};
exports.scaffoldPages = scaffoldPages;
exports.default = exports.scaffoldPages;
//# sourceMappingURL=scaffoldPages.js.map