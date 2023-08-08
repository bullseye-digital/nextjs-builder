"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const graphql_1 = require("graphql");
const nextjs_toolkit_2 = require("@silverstripe/nextjs-toolkit");
const createBulkQuery = ({ projectConfig }) => (query) => {
    var _a;
    const doc = (0, graphql_1.parse)(query);
    const fields = (0, nextjs_toolkit_1.getQueryFields)(query);
    const queryName = (0, nextjs_toolkit_1.getQueryName)(doc);
    const pluraliser = (_a = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.query.pluraliser) !== null && _a !== void 0 ? _a : nextjs_toolkit_2.defaultPluraliser;
    if (!fields || !queryName) {
        throw new Error(`Query is not properly formatted. Must have a query name and field selection:
                ${query}
            `);
    }
    if (!queryName.startsWith(`readOne`)) {
        console.log(`Query "${queryName} is not a standard read query. Cannot bulk fetch.`);
        return null;
    }
    const suffix = queryName.substring(7);
    const plural = pluraliser(suffix);
    const bulkQueryName = `read${plural}`;
    const fragments = (0, nextjs_toolkit_1.getFragments)(query);
    const bulkQuery = `
query Bulk${suffix} ($links: [String!]!, $limit: Int, $offset: Int) {
    ${bulkQueryName}(links: $links, limit: $limit, offset: $offset) {
        nodes {
            ${fields}
        }
        pageInfo {
            hasNextPage
        }
    }
}
${fragments}    
    `;
    return bulkQuery;
};
exports.default = createBulkQuery;
//# sourceMappingURL=createBulkQuery.js.map