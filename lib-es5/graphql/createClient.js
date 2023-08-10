"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var read_1 = require("../cache/read");
var nextjs_toolkit_1 = require("@silverstripe/nextjs-toolkit");
var node_fetch_1 = __importDefault(require("node-fetch"));
var graphql_1 = require("graphql");
var createClient = function (projectConfig) {
    var query = function (query, variables) {
        if (variables === void 0) { variables = {}; }
        return __awaiter(void 0, void 0, void 0, function () {
            var cacheKey, cached, existing, clientConfig, options, res, json, e_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cacheKey = (0, nextjs_toolkit_1.getCacheKey)(query, variables);
                        if (cacheKey) {
                            cached = (_a = (0, read_1.loadJSONFile)(".queryCache.json")) !== null && _a !== void 0 ? _a : {};
                            existing = (_b = cached[cacheKey]) !== null && _b !== void 0 ? _b : null;
                            if (existing) {
                                return [2 /*return*/, existing];
                            }
                        }
                        clientConfig = projectConfig.client();
                        if (!clientConfig.endpoint) {
                            throw new Error("\n            You have no graphql endpoint specified. Please add it to the \"client()\" function in ss.config.js\n            ");
                        }
                        clientConfig.options.headers["Content-Type"] = "application/json";
                        options = __assign(__assign({}, clientConfig.options), { method: "POST", body: JSON.stringify({
                                query: query,
                                variables: variables,
                            }) });
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1.default)(clientConfig.endpoint, options)];
                    case 2:
                        res = _c.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        json = _c.sent();
                        if (json.errors) {
                            throw new Error("\n    There was a problem with your GraphQL query:\n    \n    ".concat(JSON.stringify(json.errors), "\n    \n    Query:\n    \n    ").concat(query, "\n    \n    Variables:\n    \n    ").concat(JSON.stringify(variables), "\n    \n                "));
                        }
                        if (json.data) {
                            return [2 /*return*/, json.data];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        throw new Error("\n    There was a network error during the request:\n    \n    ".concat(e_1, "\n    \n    Query:\n    \n    ").concat(query, "\n    \n    Variables:\n    \n    ").concat(JSON.stringify(variables), "\n    \n            "));
                    case 5: return [2 /*return*/, null];
                }
            });
        });
    };
    var createChunkFetch = function (queryStr, variables) {
        var _a;
        if (variables === void 0) { variables = {}; }
        var doc = (0, graphql_1.parse)(queryStr);
        var queryName = (0, nextjs_toolkit_1.getQueryName)(doc);
        if (!queryName) {
            throw new Error("No query name found on ".concat(queryStr));
        }
        if (!(0, nextjs_toolkit_1.hasPageInfoField)(doc)) {
            throw new Error("Cannot chunk query ".concat(queryName, " because it has no pageInfo selection"));
        }
        var limit = (_a = variables.limit) !== null && _a !== void 0 ? _a : 100;
        var offset = 0;
        var hasMore = true;
        var fetcher = function () { return __awaiter(void 0, void 0, void 0, function () {
            var paginatedVariables, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!hasMore) {
                            return [2 /*return*/, null];
                        }
                        paginatedVariables = __assign(__assign({}, variables), { limit: limit, offset: offset });
                        return [4 /*yield*/, query(queryStr, paginatedVariables)];
                    case 1:
                        result = _a.sent();
                        hasMore = result[queryName].pageInfo.hasNextPage;
                        offset += limit;
                        return [2 /*return*/, result];
                }
            });
        }); };
        return fetcher;
    };
    return {
        query: query,
        createChunkFetch: createChunkFetch,
    };
};
exports.default = createClient;
//# sourceMappingURL=createClient.js.map