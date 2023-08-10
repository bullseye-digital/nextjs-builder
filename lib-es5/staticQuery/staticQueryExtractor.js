"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStaticQueries = exports.extractStaticQuery = void 0;
var parser_1 = require("@babel/parser");
// @ts-ignore
var traverse_1 = __importDefault(require("@babel/traverse"));
var glob_1 = __importDefault(require("glob"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var parser_options_1 = require("../babel/parser-options");
var graphql_1 = require("graphql");
var extractStaticQuery = function (absPath) {
    var ast;
    try {
        var contents = fs_1.default.readFileSync(absPath, "utf8");
        ast = (0, parser_1.parse)(contents, parser_options_1.PARSER_OPTIONS);
    }
    catch (e) {
        throw new Error("Cound not parse file ".concat(absPath, " for static query extraction: ").concat(e.message));
    }
    var functionName = null;
    var query = null;
    (0, traverse_1.default)(ast, {
        // Find any import that references useStaticQuery module
        ImportDeclaration: function (_a) {
            var node = _a.node;
            var libraryPath = node.source.value;
            if (libraryPath !== "@silverstripe/nextjs-toolkit") {
                return;
            }
            node.specifiers.some(function (specifier) {
                if (specifier.type === "ImportSpecifier" &&
                    specifier.imported.type === "Identifier" &&
                    specifier.imported.name === "useStaticQuery") {
                    functionName = specifier.local.name;
                    return true;
                }
                return false;
            });
            (0, traverse_1.default)(ast, {
                // Find any calls that use the imported useStaticQuery function
                CallExpression: function (_a) {
                    var node = _a.node;
                    if (node.callee.type !== "Identifier") {
                        return;
                    }
                    var callee = node.callee;
                    if (callee.name !== functionName) {
                        return;
                    }
                    var firstArg = node.arguments[0];
                    // Most of the time, it's a literal right in the function call
                    if (firstArg.type === "TemplateLiteral") {
                        var queryStr = firstArg.quasis[0].value.raw;
                        if (firstArg.expressions.length) {
                            console.warn("Static queries cannot contain expressions. Skipping query: ".concat(queryStr));
                            return;
                        }
                        (0, graphql_1.parse)(queryStr);
                        query = queryStr;
                        return;
                    }
                    // But it could also be a variable. If so, track it down.
                    if (firstArg.type === "Identifier") {
                        var varExpr = firstArg;
                        var varName_1 = varExpr.name;
                        var found_1 = false;
                        (0, traverse_1.default)(ast, {
                            VariableDeclarator: function (varPath) {
                                if (varPath.node.id.name !== varName_1 ||
                                    varPath.node.init.type !== "TemplateLiteral") {
                                    return;
                                }
                                varPath.traverse({
                                    TemplateLiteral: function (templatePath) {
                                        found_1 = true;
                                        var queryStr = templatePath.node.quasis[0].value.raw;
                                        (0, graphql_1.parse)(queryStr);
                                        query = queryStr;
                                    },
                                });
                            },
                        });
                        if (!found_1) {
                            console.warn("Unknown query variable: ".concat(varName_1, " in ").concat(absPath));
                        }
                    }
                }
            });
        }
    });
    return query;
};
exports.extractStaticQuery = extractStaticQuery;
var extractStaticQueries = function (baseDir) {
    var pattern = path_1.default.join(baseDir, "src/**/*.{js,jsx,ts,tsx}");
    var files = glob_1.default.sync(pattern, { absolute: true });
    return files.reduce(function (queries, absPath) {
        var query = (0, exports.extractStaticQuery)(absPath);
        if (query) {
            return __spreadArray(__spreadArray([], __read(queries), false), [query], false);
        }
        return queries;
    }, []);
};
exports.extractStaticQueries = extractStaticQueries;
//# sourceMappingURL=staticQueryExtractor.js.map