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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildrenMismatchedError = exports.NotEnoughChildrenError = exports.TextMismatchedError = exports.AttributesMismatchedError = exports.SelectorMismatchedError = exports.TexNodeMismatchedError = exports.NodeTypeMismatchedError = exports.InvalidWildcardUsageError = exports.WildCardInActualError = void 0;
var wildcard_1 = require("./wildcard");
var jsdiff = require("diff");
exports.WildCardInActualError = new Error('Wildcards are only allowed in the expected vtree');
exports.InvalidWildcardUsageError = new Error('Two consequtive wildcards are not allowed');
var NodeTypeMismatchedError = function (actual, expected, longError) {
    return new Error(prettyPrintError('Cannot compare different node types')(actual, expected, longError));
};
exports.NodeTypeMismatchedError = NodeTypeMismatchedError;
var TexNodeMismatchedError = function (actual, expected, longError) {
    return new Error(prettyPrintError('Text node mismatched')(actual, expected, longError));
};
exports.TexNodeMismatchedError = TexNodeMismatchedError;
var SelectorMismatchedError = function (actual, expected, longError) {
    return new Error(prettyPrintError('Node selectors are not matching')(actual, expected, longError));
};
exports.SelectorMismatchedError = SelectorMismatchedError;
var AttributesMismatchedError = function (actual, expected, longError) {
    return new Error(prettyPrintError('Attributes mismatched')(actual, expected, longError));
};
exports.AttributesMismatchedError = AttributesMismatchedError;
var TextMismatchedError = function (actual, expected, longError) {
    return new Error(prettyPrintError('Text property not matching')(actual, expected, longError));
};
exports.TextMismatchedError = TextMismatchedError;
var NotEnoughChildrenError = function (actual, expected, longError) {
    return new Error(prettyPrintError('Not enough children')(actual, expected, longError));
};
exports.NotEnoughChildrenError = NotEnoughChildrenError;
var ChildrenMismatchedError = function (actual, expected, longError) {
    return new Error(prettyPrintError('Children mismatched')(actual, expected, longError));
};
exports.ChildrenMismatchedError = ChildrenMismatchedError;
// TODO: Make diff customizable
var prettyPrintError = function (message) { return function (actual, expected, longError) {
    var actualSelector = removeGrandchildren(actual);
    var expectedSelector = wildcard_1.isWildcard(expected) ? expected : removeGrandchildren(expected);
    var actualString = JSON.stringify(actualSelector, null, 2);
    var expectedString = wildcard_1.isWildcard(expectedSelector) ? 'WILDCARD' : JSON.stringify(expectedSelector, null, 2);
    var diffString = jsdiff
        .createTwoFilesPatch('', '', expectedString, actualString, '', '')
        .split('\n')
        .slice(5)
        .filter(function (s) { return s.indexOf('No newline at end of file') === -1; })
        .filter(function (s) { return !(s.startsWith('-') && s.indexOf('WILDCARD') !== -1); })
        .map(function (s) { return !(s.startsWith('+') || s.startsWith('-')) ? '         ' + s : s; })
        .map(function (s) { return s.startsWith('-') ? 'expected: ' + s.slice(1) : s; })
        .map(function (s) { return s.startsWith('+') ? 'actual:   ' + s.slice(1) : s; })
        .join('\n');
    var additionalString = "\n\nactual:\n" + actualString + "\n\nexpected:\n" + expectedString;
    return message + "\n" + diffString + (longError ? additionalString : '');
}; };
var removeGrandchildren = function (vnode) {
    return (__assign(__assign({}, vnode), { children: vnode.children
            ? vnode.children
                .map(function (c) { return typeof c === 'object' ? __assign(__assign({}, c), { children: '...' }) : c; })
                .map(function (c) { return (wildcard_1.isWildcard(c) ? 'WILDCARD' : c); })
            : [] }));
};
//# sourceMappingURL=errors.js.map