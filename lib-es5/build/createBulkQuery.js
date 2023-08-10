"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var graphql_1 = require("graphql");
var nextjs_toolkit_2 = require("@silverstripe/nextjs-toolkit");
var createBulkQuery = function (_a) {
    var projectConfig = _a.projectConfig;
    return function (query) {
        var _a;
        var doc = (0, graphql_1.parse)(query);
        var fields = (0, nextjs_toolkit_1.getQueryFields)(query);
        var queryName = (0, nextjs_toolkit_1.getQueryName)(doc);
        var pluraliser = (_a = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.query.pluraliser) !== null && _a !== void 0 ? _a : nextjs_toolkit_2.defaultPluraliser;
        if (!fields || !queryName) {
            throw new Error("Query is not properly formatted. Must have a query name and field selection:\n                ".concat(query, "\n            "));
        }
        if (!queryName.startsWith("readOne")) {
            console.log("Query \"".concat(queryName, " is not a standard read query. Cannot bulk fetch."));
            return null;
        }
        var suffix = queryName.substring(7);
        var plural = pluraliser(suffix);
        var bulkQueryName = "read".concat(plural);
        var fragments = (0, nextjs_toolkit_1.getFragments)(query);
        var bulkQuery = "\nquery Bulk".concat(suffix, " ($links: [String!]!, $limit: Int, $offset: Int) {\n    ").concat(bulkQueryName, "(links: $links, limit: $limit, offset: $offset) {\n        nodes {\n            ").concat(fields, "\n        }\n        pageInfo {\n            hasNextPage\n        }\n    }\n}\n").concat(fragments, "    \n    ");
        return bulkQuery;
    };
};
exports.default = createBulkQuery;
//# sourceMappingURL=createBulkQuery.js.map