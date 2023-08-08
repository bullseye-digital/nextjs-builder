"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const staticQueryExtractor_1 = require("../staticQuery/staticQueryExtractor");
const write_1 = require("../cache/write");
const createClient_1 = __importDefault(require("../graphql/createClient"));
exports.default = async (ssConfig) => {
    // Extract static queries, and put them in the cache
    const queries = (0, staticQueryExtractor_1.extractStaticQueries)(ssConfig.baseDir);
    if (queries.length > 0) {
        console.log(`Static queries extracted: ${queries.length}`);
    }
    const api = (0, createClient_1.default)(ssConfig);
    const staticQueries = {};
    const promises = queries.map(query => {
        return new Promise((resolve) => {
            api.query(query).then((result) => {
                const key = (0, nextjs_toolkit_1.getCacheKey)(query);
                if (key) {
                    staticQueries[key] = result;
                }
                resolve();
            });
        });
    });
    return Promise.all(promises)
        .then(() => {
        (0, write_1.writeJSONFile)(`.staticQueries.json`, staticQueries);
    });
};
//# sourceMappingURL=cacheStaticQueries.js.map