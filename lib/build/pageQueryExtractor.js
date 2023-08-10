"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPageQueries = void 0;
const parser_1 = require("@babel/parser");
// @ts-ignore
const traverse_1 = __importDefault(require("@babel/traverse"));
const fs_1 = __importDefault(require("fs"));
const parser_options_1 = require("../babel/parser-options");
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const graphql_1 = require("graphql");
const extractPageQueries = (absPath) => {
    let ast;
    try {
        const contents = fs_1.default.readFileSync(absPath, `utf8`);
        ast = (0, parser_1.parse)(contents, parser_options_1.PARSER_OPTIONS);
    }
    catch (e) {
        throw new Error(`Cound not parse file ${absPath} for page query extraction: ${e.message}`);
    }
    let query = {
        query: null,
        batchQuery: null,
    };
    (0, traverse_1.default)(ast, {
        // Find any import that references useStaticQuery module
        ExportNamedDeclaration({ node }) {
            var _a;
            if (((_a = node.declaration) === null || _a === void 0 ? void 0 : _a.type) !== `VariableDeclaration`) {
                return;
            }
            const declaration = node.declaration;
            const declarator = declaration.declarations[0];
            if (!declarator || declarator.type !== `VariableDeclarator`) {
                return;
            }
            if (declarator.id.type !== `Identifier`) {
                return;
            }
            const id = declarator.id;
            const varName = id.name;
            if (varName === `query`) {
                const init = declarator.init;
                if (!init || init.type !== `TemplateLiteral`) {
                    return;
                }
                const queryStr = init.quasis[0].value.raw;
                if (init.expressions.length) {
                    console.warn(`Page queries cannot contain expressions. Skipping query: ${queryStr}`);
                    return;
                }
                const doc = (0, graphql_1.parse)(queryStr);
                if (!(0, nextjs_toolkit_1.hasTopLevelField)(doc, `link`)) {
                    console.warn(`
                    Query ${(0, nextjs_toolkit_1.getQueryName)(doc)} has no "link" field selected. This is a required
                    field for matching queries to pages.
                `);
                    return;
                }
                query[varName] = queryStr;
            }
            else if (varName === `batchQuery`) {
                const init = declarator.init;
                if (!init || init.type !== `TemplateLiteral`) {
                    return;
                }
                const queryStr = init.quasis[0].value.raw;
                if (init.expressions.length) {
                    console.warn(`Page queries cannot contain expressions. Skipping query: ${queryStr}`);
                    return;
                }
                query[varName] = queryStr;
            }
        }
    });
    return query;
};
exports.extractPageQueries = extractPageQueries;
//# sourceMappingURL=pageQueryExtractor.js.map