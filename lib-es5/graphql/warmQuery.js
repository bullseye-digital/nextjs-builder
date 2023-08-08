"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var write_1 = require("../cache/write");
var read_1 = require("../cache/read");
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var warmQuery = function (query, variables, result) {
    var _a;
    var key = (0, nextjs_toolkit_1.getCacheKey)(query, variables);
    if (!key) {
        return;
    }
    var queries = (_a = (0, read_1.loadJSONFile)(".queryCache.json")) !== null && _a !== void 0 ? _a : {};
    queries[key] = result;
    (0, write_1.writeJSONFile)(".queryCache.json", queries);
};
exports.default = warmQuery;
//# sourceMappingURL=warmQuery.js.map