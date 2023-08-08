"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPageQueries = void 0;
var parser_1 = require("@babel/parser");
// @ts-ignore
var traverse_1 = __importDefault(require("@babel/traverse"));
var fs_1 = __importDefault(require("fs"));
var parser_options_1 = require("../babel/parser-options");
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var graphql_1 = require("graphql");
var extractPageQueries = function (absPath) {
    var ast;
    try {
        var contents = fs_1.default.readFileSync(absPath, "utf8");
        ast = (0, parser_1.parse)(contents, parser_options_1.PARSER_OPTIONS);
    }
    catch (e) {
        throw new Error("Cound not parse file ".concat(absPath, " for page query extraction: ").concat(e.message));
    }
    var query = {
        query: null,
        batchQuery: null,
    };
    (0, traverse_1.default)(ast, {
        // Find any import that references useStaticQuery module
        ExportNamedDeclaration: function (_a) {
            var _b;
            var node = _a.node;
            if (((_b = node.declaration) === null || _b === void 0 ? void 0 : _b.type) !== "VariableDeclaration") {
                return;
            }
            var declaration = node.declaration;
            var declarator = declaration.declarations[0];
            if (!declarator || declarator.type !== "VariableDeclarator") {
                return;
            }
            if (declarator.id.type !== "Identifier") {
                return;
            }
            var id = declarator.id;
            var varName = id.name;
            if (varName === "query") {
                var init = declarator.init;
                if (!init || init.type !== "TemplateLiteral") {
                    return;
                }
                var queryStr = init.quasis[0].value.raw;
                if (init.expressions.length) {
                    console.warn("Page queries cannot contain expressions. Skipping query: ".concat(queryStr));
                    return;
                }
                var doc = (0, graphql_1.parse)(queryStr);
                if (!(0, nextjs_toolkit_1.hasTopLevelField)(doc, "link")) {
                    console.warn("\n                    Query ".concat((0, nextjs_toolkit_1.getQueryName)(doc), " has no \"link\" field selected. This is a required\n                    field for matching queries to pages.\n                "));
                    return;
                }
                query[varName] = queryStr;
            }
            else if (varName === "batchQuery") {
                var init = declarator.init;
                if (!init || init.type !== "TemplateLiteral") {
                    return;
                }
                var queryStr = init.quasis[0].value.raw;
                if (init.expressions.length) {
                    console.warn("Page queries cannot contain expressions. Skipping query: ".concat(queryStr));
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