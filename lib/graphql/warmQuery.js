"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const write_1 = require("../cache/write");
const read_1 = require("../cache/read");
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const warmQuery = (query, variables, result) => {
    var _a;
    const key = (0, nextjs_toolkit_1.getCacheKey)(query, variables);
    if (!key) {
        return;
    }
    const queries = (_a = (0, read_1.loadJSONFile)(`.queryCache.json`)) !== null && _a !== void 0 ? _a : {};
    queries[key] = result;
    (0, write_1.writeJSONFile)(`.queryCache.json`, queries);
};
exports.default = warmQuery;
//# sourceMappingURL=warmQuery.js.map