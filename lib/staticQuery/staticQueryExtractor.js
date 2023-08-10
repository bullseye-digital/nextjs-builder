"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStaticQueries = exports.extractStaticQuery = void 0;
const parser_1 = require("@babel/parser");
// @ts-ignore
const traverse_1 = __importDefault(require("@babel/traverse"));
const glob_1 = __importDefault(require("glob"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const parser_options_1 = require("../babel/parser-options");
const graphql_1 = require("graphql");
const extractStaticQuery = (absPath) => {
    let ast;
    try {
        const contents = fs_1.default.readFileSync(absPath, `utf8`);
        ast = (0, parser_1.parse)(contents, parser_options_1.PARSER_OPTIONS);
    }
    catch (e) {
        throw new Error(`Cound not parse file ${absPath} for static query extraction: ${e.message}`);
    }
    let functionName = null;
    let query = null;
    (0, traverse_1.default)(ast, {
        // Find any import that references useStaticQuery module
        ImportDeclaration({ node }) {
            const libraryPath = node.source.value;
            if (libraryPath !== `@silverstripe/nextjs-toolkit`) {
                return;
            }
            node.specifiers.some(specifier => {
                if (specifier.type === `ImportSpecifier` &&
                    specifier.imported.type === `Identifier` &&
                    specifier.imported.name === `useStaticQuery`) {
                    functionName = specifier.local.name;
                    return true;
                }
                return false;
            });
            (0, traverse_1.default)(ast, {
                // Find any calls that use the imported useStaticQuery function
                CallExpression({ node }) {
                    if (node.callee.type !== `Identifier`) {
                        return;
                    }
                    const callee = node.callee;
                    if (callee.name !== functionName) {
                        return;
                    }
                    const firstArg = node.arguments[0];
                    // Most of the time, it's a literal right in the function call
                    if (firstArg.type === `TemplateLiteral`) {
                        const queryStr = firstArg.quasis[0].value.raw;
                        if (firstArg.expressions.length) {
                            console.warn(`Static queries cannot contain expressions. Skipping query: ${queryStr}`);
                            return;
                        }
                        (0, graphql_1.parse)(queryStr);
                        query = queryStr;
                        return;
                    }
                    // But it could also be a variable. If so, track it down.
                    if (firstArg.type === `Identifier`) {
                        const varExpr = firstArg;
                        const varName = varExpr.name;
                        let found = false;
                        (0, traverse_1.default)(ast, {
                            VariableDeclarator(varPath) {
                                if (varPath.node.id.name !== varName ||
                                    varPath.node.init.type !== `TemplateLiteral`) {
                                    return;
                                }
                                varPath.traverse({
                                    TemplateLiteral(templatePath) {
                                        found = true;
                                        const queryStr = templatePath.node.quasis[0].value.raw;
                                        (0, graphql_1.parse)(queryStr);
                                        query = queryStr;
                                    },
                                });
                            },
                        });
                        if (!found) {
                            console.warn(`Unknown query variable: ${varName} in ${absPath}`);
                        }
                    }
                }
            });
        }
    });
    return query;
};
exports.extractStaticQuery = extractStaticQuery;
const extractStaticQueries = (baseDir) => {
    const pattern = path_1.default.join(baseDir, `src/**/*.{js,jsx,ts,tsx}`);
    const files = glob_1.default.sync(pattern, { absolute: true });
    return files.reduce((queries, absPath) => {
        const query = (0, exports.extractStaticQuery)(absPath);
        if (query) {
            return [...queries, query];
        }
        return queries;
    }, []);
};
exports.extractStaticQueries = extractStaticQueries;
//# sourceMappingURL=staticQueryExtractor.js.map