"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const createGetQueryForType = ({ cacheManifest: { queryManifest, typeAncestry } }) => (type) => {
    var _a, _b, _c;
    // @ts-ignore
    const ancestors = (_a = typeAncestry[type]) !== null && _a !== void 0 ? _a : [];
    const queriesKey = (0, nextjs_toolkit_1.resolveAncestry)(type, ancestors, Object.keys(queryManifest));
    // @ts-ignore
    return queriesKey ? (_c = (_b = queryManifest[queriesKey]) === null || _b === void 0 ? void 0 : _b.source) !== null && _c !== void 0 ? _c : null : null;
};
exports.default = createGetQueryForType;
//# sourceMappingURL=createGetQueryForType.js.map