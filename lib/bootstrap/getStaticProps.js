"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const queries_1 = require("../build/queries");
const createGetQueryForType_1 = __importDefault(require("../build/createGetQueryForType"));
const createClient_1 = __importDefault(require("../graphql/createClient"));
// Formats current time in a given IANA timezone as "YYYY-MM-DD HH:mm:SS"
const nowInTimeZone = (timeZone) => {
    const d = new Date();
    // Get date/time parts in the target timezone
    const dtf = new Intl.DateTimeFormat("en-NZ", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    const parts = dtf.formatToParts(d);
    // Return date-time without timezone, e.g. "2025-09-26 06:58:00"
    const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
    return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
};
const getStaticProps = (project) => async (context) => {
    var _a, _b, _c, _d, _e;
    const getQueryForType = (0, createGetQueryForType_1.default)(project);
    const api = (0, createClient_1.default)(project.projectConfig);
    const { getPropsManifest, typeAncestry, availableTemplates } = project.cacheManifest;
    const page = (_b = (_a = context === null || context === void 0 ? void 0 : context.params) === null || _a === void 0 ? void 0 : _a.page) !== null && _b !== void 0 ? _b : [];
    let url;
    if (Array.isArray(page)) {
        url = page.join(`/`);
    }
    else {
        url = page;
    }
    url = (0, nextjs_toolkit_1.linkify)(url);
    if (url.match(/\.[^\/]+$/)) {
        console.log(`Not found:`, url);
        return {
            notFound: true,
        };
    }
    if (!availableTemplates) {
        throw new Error(`No available templates found`);
    }
    const templates = Object.keys(availableTemplates);
    try {
        const typeResolutionResult = await api.query(queries_1.TYPE_RESOLUTION_QUERY, { links: [url] });
        if (!typeResolutionResult ||
            typeResolutionResult.typesForLinks.length === 0) {
            return {
                notFound: true,
            };
        }
        const data = {
            query: null,
            extraProps: null,
        };
        const result = typeResolutionResult.typesForLinks[0];
        const { type } = result;
        // @ts-ignore
        const ancestors = (_c = typeAncestry[type]) !== null && _c !== void 0 ? _c : [];
        const stage = context.draftMode ? `DRAFT` : `LIVE`;
        const now = nowInTimeZone("Pacific/Auckland");
        const queryStr = getQueryForType(type);
        if (queryStr) {
            // Provide an optional `$now` variable for queries that use it.
            // Servers ignore extra variables if not declared in the operation.
            data.query = (_d = (await api.query(queryStr, { link: url, stage, now }))) !== null && _d !== void 0 ? _d : null;
        }
        const propsKey = (0, nextjs_toolkit_1.resolveAncestry)(type, ancestors, Object.keys(getPropsManifest));
        // @ts-ignore
        const propsFunc = propsKey ? (_e = getPropsManifest[propsKey]) !== null && _e !== void 0 ? _e : null : null;
        if (propsFunc) {
            data.extraProps = await propsFunc(data.query);
        }
        let basePageData = null;
        if (data.query) {
            for (const key in data.query) {
                const leObj = data.query[key];
                if (leObj.basePageData) {
                    basePageData = JSON.parse(leObj.basePageData);
                }
            }
        }
        if (basePageData !== null && stage !== `DRAFT`) {
            if (basePageData.isPublishedInTheFuture) {
                console.log('IS 404 ... ');
                return {
                    notFound: true,
                };
            }
        }
        const componentProps = {
            props: {
                data,
                type,
                templates,
            },
            revalidate: 300 // 900 // 15 minutes
        };
        return componentProps;
        // might be not found  
    }
    catch (err) {
        // @ts-ignore
        if (typeof err.message !== 'undefined' && err.message.includes('could not be found')) {
            return {
                notFound: true,
            };
        }
        throw err;
    }
};
exports.default = getStaticProps;
//# sourceMappingURL=getStaticProps.js.map