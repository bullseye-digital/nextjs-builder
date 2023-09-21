"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const read_1 = require("../cache/read");
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const node_fetch_1 = __importDefault(require("node-fetch"));
const graphql_1 = require("graphql");
const createClient = (projectConfig) => {
    const query = async (query, variables = {}) => {
        var _a, _b;
        const cacheKey = (0, nextjs_toolkit_1.getCacheKey)(query, variables);
        if (cacheKey) {
            const cached = (_a = (0, read_1.loadJSONFile)(`.queryCache.json`)) !== null && _a !== void 0 ? _a : {};
            const existing = (_b = cached[cacheKey]) !== null && _b !== void 0 ? _b : null;
            if (existing) {
                return existing;
            }
        }
        const clientConfig = projectConfig.client();
        if (!clientConfig.endpoint) {
            throw new Error(`
            You have no graphql endpoint specified. Please add it to the "client()" function in ss.config.js
            `);
        }
        clientConfig.options.headers["Content-Type"] = `application/json`;
        const options = Object.assign(Object.assign({}, clientConfig.options), { method: `POST`, body: JSON.stringify({
                query,
                variables,
            }) });
        try {
            const res = await (0, node_fetch_1.default)(clientConfig.endpoint, options);
            const json = await res.json();
            if (json.errors) {
                throw new Error(`
    There was a problem with your GraphQL query:
    
    ${JSON.stringify(json.errors)}
    
    Query:
    
    ${query}
    
    Variables:
    
    ${JSON.stringify(variables)}
    
                `);
            }
            if (json.data) {
                return json.data;
            }
        }
        catch (e) {
            throw new Error(`
    There was a network error during the request:
    
    ${e}
    
    Query:
    
    ${query}
    
    Variables:
    
    ${JSON.stringify(variables)}
    
            `);
        }
        return null;
    };
    const createChunkFetch = (queryStr, variables = {}) => {
        var _a;
        const doc = (0, graphql_1.parse)(queryStr);
        const queryName = (0, nextjs_toolkit_1.getQueryName)(doc);
        if (!queryName) {
            throw new Error(`No query name found on ${queryStr}`);
        }
        if (!(0, nextjs_toolkit_1.hasPageInfoField)(doc)) {
            throw new Error(`Cannot chunk query ${queryName} because it has no pageInfo selection`);
        }
        const limit = (_a = variables.limit) !== null && _a !== void 0 ? _a : 100;
        let offset = 0;
        let hasMore = true;
        const fetcher = async () => {
            if (!hasMore) {
                return null;
            }
            const paginatedVariables = Object.assign(Object.assign({}, variables), { limit,
                offset });
            const result = await query(queryStr, paginatedVariables);
            hasMore = result[queryName].pageInfo.hasNextPage;
            offset += limit;
            return result;
        };
        return fetcher;
    };
    return {
        query,
        createChunkFetch,
    };
};
exports.default = createClient;
//# sourceMappingURL=createClient.js.map