"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectElementalBlocks = exports.collectGetProps = exports.collectQueries = exports.collectTemplates = exports.createName = void 0;
// @ts-ignore
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
var createName = function (absPath) {
    var match = path_1.default.basename(absPath).match(/^[A-Za-z0-9_]+/);
    if (!match) {
        throw new Error("Invalid filename ".concat(absPath));
    }
    var candidate = match[0];
    if (["props", "component", "query"].includes(candidate)) {
        return path_1.default.basename(path_1.default.dirname(absPath));
    }
    return candidate;
};
exports.createName = createName;
var collectTemplates = function (baseDir) {
    var pattern = path_1.default.join(baseDir, "src/templates/**/*.{js,jsx,ts,tsx}");
    var nameToPath = {};
    var result = glob_1.default.sync(pattern, { absolute: true });
    result.filter(function (absPath) { return (!absPath.match(/\.props\.(js|ts)$/)) &&
        !absPath.match(/\/props\.(js|ts)$/); })
        .forEach(function (absPath) {
        nameToPath[(0, exports.createName)(absPath)] = absPath;
    });
    return nameToPath;
};
exports.collectTemplates = collectTemplates;
var collectQueries = function (baseDir) {
    var e_1, _a;
    var pattern = path_1.default.join(baseDir, "src/**/*.graphql");
    var nameToPath = {};
    var result = glob_1.default.sync(pattern, { absolute: true });
    try {
        for (var result_1 = __values(result), result_1_1 = result_1.next(); !result_1_1.done; result_1_1 = result_1.next()) {
            var absPath = result_1_1.value;
            var rel = path_1.default.relative("".concat(process.cwd(), "/src"), absPath);
            if (!rel.startsWith("fragments")) {
                nameToPath[(0, exports.createName)(absPath)] = absPath;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (result_1_1 && !result_1_1.done && (_a = result_1.return)) _a.call(result_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return nameToPath;
};
exports.collectQueries = collectQueries;
var collectGetProps = function (baseDir) {
    var e_2, _a;
    var patterns = [
        path_1.default.join(baseDir, "src/**/*.props.{js,ts}"),
        path_1.default.join(baseDir, "src/**/props.{js,ts}"),
    ];
    var nameToPath = {};
    var results = [];
    patterns.forEach(function (pattern) {
        results = __spreadArray(__spreadArray([], __read(results), false), __read(glob_1.default.sync(pattern, { absolute: true })), false);
    });
    try {
        for (var results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
            var absPath = results_1_1.value;
            var rel = path_1.default.relative(path_1.default.join(baseDir, "src"), absPath);
            if (!rel.startsWith("fragments")) {
                nameToPath[(0, exports.createName)(absPath)] = absPath;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return nameToPath;
};
exports.collectGetProps = collectGetProps;
var collectElementalBlocks = function (baseDir, elementalDir) {
    var pattern = path_1.default.join(baseDir, "src/".concat(elementalDir, "/**/*.{js,jsx,ts,tsx}"));
    var nameToPath = {};
    var result = glob_1.default.sync(pattern, { absolute: true });
    result.forEach(function (absPath) {
        nameToPath[(0, exports.createName)(absPath)] = absPath;
    });
    return nameToPath;
};
exports.collectElementalBlocks = collectElementalBlocks;
//# sourceMappingURL=collectors.js.map