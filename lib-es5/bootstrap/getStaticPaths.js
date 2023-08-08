"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaticPaths = void 0;
var queries_1 = require("../build/queries");
var createGetQueryForType_1 = __importDefault(require("../build/createGetQueryForType"));
var createBulkQuery_1 = __importDefault(require("../build/createBulkQuery"));
var graphql_1 = require("graphql");
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var createClient_1 = __importDefault(require("../graphql/createClient"));
var warmQuery_1 = __importDefault(require("../graphql/warmQuery"));
var getStaticPaths = function (project) { return function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var api, staticPayloadResult, links, paths, typeResolutionResult, typeToLinks, typeToQuery, getQueryForType, bulkQuery, _loop_1, _a, _b, _c, type, links_1, e_1_1;
    var e_1, _d;
    var _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                api = (0, createClient_1.default)(project.projectConfig);
                return [4 /*yield*/, api.query(queries_1.STATIC_PAYLOAD_QUERY)];
            case 1:
                staticPayloadResult = (_e = (_k.sent())) !== null && _e !== void 0 ? _e : null;
                if (!staticPayloadResult) {
                    console.warn("Could not get a static build!");
                    return [2 /*return*/, Promise.reject()];
                }
                links = (_g = (_f = staticPayloadResult.staticBuild) === null || _f === void 0 ? void 0 : _f.links) !== null && _g !== void 0 ? _g : [];
                paths = [];
                links.forEach(function (link) {
                    paths.push({ params: { page: link.link.split("/") } });
                });
                return [4 /*yield*/, api.query(queries_1.TYPE_RESOLUTION_QUERY, { links: links.map(function (l) { return l.link; }) })];
            case 2:
                typeResolutionResult = _k.sent();
                typeToLinks = new Map();
                typeToQuery = new Map();
                getQueryForType = (0, createGetQueryForType_1.default)(project);
                typeResolutionResult.typesForLinks.forEach(function (result) {
                    var _a;
                    (0, warmQuery_1.default)(queries_1.TYPE_RESOLUTION_QUERY, { links: [(0, nextjs_toolkit_1.linkify)(result.link)] }, { typesForLinks: [{ link: result.link, type: result.type }] });
                    if (!typeToLinks.has(result.type)) {
                        typeToLinks.set(result.type, new Set());
                    }
                    (_a = typeToLinks.get(result.type)) === null || _a === void 0 ? void 0 : _a.add(result.link);
                    // Capture the query for each type while we're here
                    if (!typeToQuery.has(result.type)) {
                        var query = getQueryForType(result.type);
                        if (query) {
                            typeToQuery.set(result.type, query);
                        }
                    }
                });
                bulkQuery = (0, createBulkQuery_1.default)(project);
                _loop_1 = function (type, links_1) {
                    var singleQuery, doc, queries, singleQueryName, newQuery, newQueryName, fetch_1, chunk, records;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                singleQuery = typeToQuery.get(type);
                                if (!singleQuery) {
                                    return [2 /*return*/, "continue"];
                                }
                                doc = (0, graphql_1.parse)(singleQuery);
                                queries = (0, nextjs_toolkit_1.getQueryNodes)(doc);
                                if (queries.length > 1) {
                                    console.warn("Query has multiple query fields: ".concat(queries.join(', '), "\n                and is ineligible for bulk fetching."));
                                    return [2 /*return*/, "continue"];
                                }
                                singleQueryName = (0, nextjs_toolkit_1.getQueryName)(doc);
                                if (!(0, nextjs_toolkit_1.hasTopLevelField)(doc, "link")) {
                                    console.warn("Query ".concat(singleQueryName, " ").concat(singleQuery, " does not have a link field in its selection set\n                and is ineligible for bulk fetching."));
                                    return [2 /*return*/, "continue"];
                                }
                                newQuery = bulkQuery(singleQuery);
                                if (!newQuery) {
                                    return [2 /*return*/, "continue"];
                                }
                                newQueryName = (0, nextjs_toolkit_1.getQueryName)((0, graphql_1.parse)(newQuery));
                                if (!newQueryName) {
                                    return [2 /*return*/, "continue"];
                                }
                                fetch_1 = api.createChunkFetch(newQuery, {
                                    limit: 25,
                                    links: __spreadArray([], __read(links_1), false),
                                });
                                chunk = void 0;
                                _l.label = 1;
                            case 1: return [4 /*yield*/, fetch_1()];
                            case 2:
                                if (!(chunk = _l.sent())) return [3 /*break*/, 3];
                                records = (_j = (_h = chunk[newQueryName]) === null || _h === void 0 ? void 0 : _h.nodes) !== null && _j !== void 0 ? _j : [];
                                records.forEach(function (record) {
                                    var _a;
                                    var link = (0, nextjs_toolkit_1.linkify)(record.link);
                                    // Bulk queries don't apply to previews
                                    var stage = "LIVE";
                                    var queryResult = (_a = {},
                                        _a[singleQueryName] = record,
                                        _a);
                                    (0, warmQuery_1.default)(singleQuery, { link: link, stage: stage }, queryResult);
                                });
                                return [3 /*break*/, 1];
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _k.label = 3;
            case 3:
                _k.trys.push([3, 8, 9, 10]);
                _a = __values(typeToLinks.entries()), _b = _a.next();
                _k.label = 4;
            case 4:
                if (!!_b.done) return [3 /*break*/, 7];
                _c = __read(_b.value, 2), type = _c[0], links_1 = _c[1];
                return [5 /*yield**/, _loop_1(type, links_1)];
            case 5:
                _k.sent();
                _k.label = 6;
            case 6:
                _b = _a.next();
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_1_1 = _k.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/, {
                    paths: paths,
                    fallback: "blocking",
                }];
        }
    });
}); }; };
exports.getStaticPaths = getStaticPaths;
exports.default = exports.getStaticPaths;
//# sourceMappingURL=getStaticPaths.js.map