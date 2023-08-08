"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var createGetQueryForType = function (_a) {
    var _b = _a.cacheManifest, queryManifest = _b.queryManifest, typeAncestry = _b.typeAncestry;
    return function (type) {
        var _a, _b, _c;
        // @ts-ignore
        var ancestors = (_a = typeAncestry[type]) !== null && _a !== void 0 ? _a : [];
        var queriesKey = (0, nextjs_toolkit_1.resolveAncestry)(type, ancestors, Object.keys(queryManifest));
        // @ts-ignore
        return queriesKey ? (_c = (_b = queryManifest[queriesKey]) === null || _b === void 0 ? void 0 : _b.source) !== null && _c !== void 0 ? _c : null : null;
    };
};
exports.default = createGetQueryForType;
//# sourceMappingURL=createGetQueryForType.js.map