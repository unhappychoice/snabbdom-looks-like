"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObj = exports.isWildcard = exports.Wildcard = void 0;
function Wildcard() {
    return {
        sel: '',
        elm: undefined,
        text: undefined,
        key: undefined,
        children: [],
        data: {
            isWildcard: true,
        },
    };
}
exports.Wildcard = Wildcard;
var isWildcard = function (vnode) {
    return exports.isObj(vnode) && vnode.data && vnode.data.isWildcard;
};
exports.isWildcard = isWildcard;
var isObj = function (a) { return typeof a === 'object'; };
exports.isObj = isObj;
//# sourceMappingURL=wildcard.js.map