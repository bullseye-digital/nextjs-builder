"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticPaths = void 0;
const queries_1 = require("../build/queries");
const createGetQueryForType_1 = __importDefault(require("../build/createGetQueryForType"));
const createBulkQuery_1 = __importDefault(require("../build/createBulkQuery"));
const graphql_1 = require("graphql");
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const createClient_1 = __importDefault(require("../graphql/createClient"));
const warmQuery_1 = __importDefault(require("../graphql/warmQuery"));
const getStaticPaths = (project) => async (context) => {
    var _a, _b, _c, _d, _e;
    const api = (0, createClient_1.default)(project.projectConfig);
    const staticPayloadResult = (_a = (await api.query(queries_1.STATIC_PAYLOAD_QUERY))) !== null && _a !== void 0 ? _a : null;
    if (!staticPayloadResult) {
        console.warn(`Could not get a static build!`);
        return Promise.reject();
    }
    // Build a list of all the links that need to statically generated
    const links = (_c = (_b = staticPayloadResult.staticBuild) === null || _b === void 0 ? void 0 : _b.links) !== null && _c !== void 0 ? _c : [];
    const paths = [];
    links.forEach(link => {
        paths.push({ params: { page: link.link.split(`/`) } });
    });
    // Warm the cache for future interrogations of link => type
    const typeResolutionResult = await api.query(queries_1.TYPE_RESOLUTION_QUERY, { links: links.map(l => l.link) });
    const typeToLinks = new Map();
    const typeToQuery = new Map();
    const getQueryForType = (0, createGetQueryForType_1.default)(project);
    typeResolutionResult.typesForLinks.forEach(result => {
        var _a;
        (0, warmQuery_1.default)(queries_1.TYPE_RESOLUTION_QUERY, { links: [(0, nextjs_toolkit_1.linkify)(result.link)] }, { typesForLinks: [{ link: result.link, type: result.type }] });
        if (!typeToLinks.has(result.type)) {
            typeToLinks.set(result.type, new Set());
        }
        (_a = typeToLinks.get(result.type)) === null || _a === void 0 ? void 0 : _a.add(result.link);
        // Capture the query for each type while we're here
        if (!typeToQuery.has(result.type)) {
            const query = getQueryForType(result.type);
            if (query) {
                typeToQuery.set(result.type, query);
            }
        }
    });
    // Bulk query caching
    const bulkQuery = (0, createBulkQuery_1.default)(project);
    for (let [type, links] of typeToLinks.entries()) {
        const singleQuery = typeToQuery.get(type);
        if (!singleQuery) {
            continue;
        }
        const doc = (0, graphql_1.parse)(singleQuery);
        const queries = (0, nextjs_toolkit_1.getQueryNodes)(doc);
        if (queries.length > 1) {
            console.warn(`Query has multiple query fields: ${queries.join(', ')}
                and is ineligible for bulk fetching.`);
            continue;
        }
        const singleQueryName = (0, nextjs_toolkit_1.getQueryName)(doc);
        if (!(0, nextjs_toolkit_1.hasTopLevelField)(doc, `link`)) {
            console.warn(`Query ${singleQueryName} ${singleQuery} does not have a link field in its selection set
                and is ineligible for bulk fetching.`);
            continue;
        }
        // Rewrite the single record query to multiple, e.g. readOnePage => readPages
        const newQuery = bulkQuery(singleQuery);
        if (!newQuery) {
            continue;
        }
        const newQueryName = (0, nextjs_toolkit_1.getQueryName)((0, graphql_1.parse)(newQuery));
        if (!newQueryName) {
            continue;
        }
        // Bulk fetch the records and warm the cache
        const fetch = api.createChunkFetch(newQuery, {
            limit: 25,
            links: [...links],
        });
        let chunk;
        while ((chunk = await fetch())) {
            const records = (_e = (_d = chunk[newQueryName]) === null || _d === void 0 ? void 0 : _d.nodes) !== null && _e !== void 0 ? _e : [];
            records.forEach(record => {
                const link = (0, nextjs_toolkit_1.linkify)(record.link);
                // Bulk queries don't apply to previews
                const stage = `LIVE`;
                const queryResult = {
                    [singleQueryName]: record
                };
                (0, warmQuery_1.default)(singleQuery, { link, stage }, queryResult);
            });
        }
    }
    return {
        paths,
        fallback: `blocking`,
    };
};
exports.getStaticPaths = getStaticPaths;
exports.default = exports.getStaticPaths;
//# sourceMappingURL=getStaticPaths.js.map