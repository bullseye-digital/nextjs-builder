"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slash = function (path) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(path);
    var hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }
    return path.replace(/\\/g, '/');
};
exports.default = slash;
//# sourceMappingURL=slash.js.map