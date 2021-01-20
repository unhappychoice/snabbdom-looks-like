import { VNode } from 'snabbdom/vnode';
import { isWildcard } from './wildcard';
import * as jsdiff from 'diff';

export const WildCardInActualError = new Error(
    'Wildcards are only allowed in the expected vtree'
);
export const InvalidWildcardUsageError = new Error(
    'Two consequtive wildcards are not allowed'
);

export const NodeTypeMismatchedError = (
    actual: any,
    expected: any,
    longError: boolean
) =>
    new Error(
        prettyPrintError('Cannot compare different node types')(
            actual,
            expected,
            longError
        )
    );

export const TexNodeMismatchedError = (
    actual: any,
    expected: any,
    longError: boolean
) =>
    new Error(
        prettyPrintError('Text node mismatched')(actual, expected, longError)
    );

export const SelectorMismatchedError = (
    actual: any,
    expected: any,
    longError: boolean
) =>
    new Error(
        prettyPrintError('Node selectors are not matching')(
            actual,
            expected,
            longError
        )
    );

export const AttributesMismatchedError = (
    actual: any,
    expected: any,
    longError: boolean
) =>
    new Error(
        prettyPrintError('Attributes mismatched')(actual, expected, longError)
    );

export const TextMismatchedError = (
    actual: any,
    expected: any,
    longError: boolean
) =>
    new Error(
        prettyPrintError('Text property not matching')(
            actual,
            expected,
            longError
        )
    );

export const NotEnoughChildrenError = (
    actual: any,
    expected: any,
    longError: boolean
) =>
    new Error(
        prettyPrintError('Not enough children')(actual, expected, longError)
    );

export const ChildrenMismatchedError = (
    actual: any,
    expected: any,
    longError: boolean
) =>
    new Error(
        prettyPrintError('Children mismatched')(actual, expected, longError)
    );

// TODO: Make diff customizable
const prettyPrintError = (message: string) => (
    actual: any,
    expected: any,
    longError: boolean
): string => {
    const actualSelector = removeGrandchildren(actual);
    const expectedSelector = isWildcard(expected)
        ? expected
        : removeGrandchildren(expected);

    const actualString = JSON.stringify(actualSelector, null, 2);
    const expectedString = isWildcard(expectedSelector)
        ? 'WILDCARD'
        : JSON.stringify(expectedSelector, null, 2);

    const diffString = jsdiff
        .createTwoFilesPatch('', '', expectedString, actualString, '', '')
        .split('\n')
        .slice(5)
        .filter((s) => s.indexOf('No newline at end of file') === -1)
        .filter((s) => !(s.startsWith('-') && s.indexOf('WILDCARD') !== -1))
        .map((s) =>
            !(s.startsWith('+') || s.startsWith('-')) ? '         ' + s : s
        )
        .map((s) => (s.startsWith('-') ? 'expected: ' + s.slice(1) : s))
        .map((s) => (s.startsWith('+') ? 'actual:   ' + s.slice(1) : s))
        .join('\n');

    const additionalString = `\n\nactual:\n${actualString}\n\nexpected:\n${expectedString}`;

    return `${message}\n${diffString}${longError ? additionalString : ''}`;
};

const removeGrandchildren = (vnode: VNode) => ({
    ...vnode,
    children: vnode.children
        ? vnode.children
              .map((c) =>
                  typeof c === 'object' ? { ...c, children: '...' } : c
              )
              .map((c) => (isWildcard(c) ? 'WILDCARD' : c))
        : [],
});
