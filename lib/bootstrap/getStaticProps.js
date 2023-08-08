"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
const queries_1 = require("../build/queries");
const createGetQueryForType_1 = __importDefault(require("../build/createGetQueryForType"));
const createClient_1 = __importDefault(require("../graphql/createClient"));
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
    const queryStr = getQueryForType(type);
    if (queryStr) {
        data.query = (_d = (await api.query(queryStr, { link: url, stage }))) !== null && _d !== void 0 ? _d : null;
    }
    const propsKey = (0, nextjs_toolkit_1.resolveAncestry)(type, ancestors, Object.keys(getPropsManifest));
    // @ts-ignore
    const propsFunc = propsKey ? (_e = getPropsManifest[propsKey]) !== null && _e !== void 0 ? _e : null : null;
    if (propsFunc) {
        data.extraProps = await propsFunc(data.query);
    }
    const componentProps = {
        props: {
            data,
            type,
            templates,
        },
    };
    return componentProps;
};
exports.default = getStaticProps;
//# sourceMappingURL=getStaticProps.js.map