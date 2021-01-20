import { VNode } from 'snabbdom/vnode';
import { isObj, isWildcard } from '../wildcard';
import {
    AttributesMismatchedError,
    NodeTypeMismatchedError,
    SelectorMismatchedError,
    TextMismatchedError,
    WildCardInActualError,
} from '../errors';

export { assertNodeChildren } from './assertNodeChildren';

type NodeType = 'string' | 'object' | 'valid';
type VNodeAssertion = (
    actual: VNode,
    expected: VNode,
    longError: boolean
) => void;

export const assertNodeType = (
    actual: VNode | string,
    expected: VNode | string | Symbol,
    longError: boolean
): NodeType => {
    if (typeof actual === 'string' && typeof expected === 'string') {
        return 'string';
    } else if (typeof actual === 'string' || typeof expected === 'string') {
        throw NodeTypeMismatchedError(actual, expected, longError);
    } else if (isWildcard(actual)) {
        throw WildCardInActualError;
    } else if (isObj(actual) && isWildcard(expected)) {
        return 'valid';
    } else if (isObj(actual) && isObj(expected)) {
        return 'object';
    }

    throw new Error('Unrecognized actual and expected type pattern');
};

// TODO: WildCardClass
// TODO: exactly or is subset or ...
export const assertNodeSelector: VNodeAssertion = (
    actual,
    expected,
    longError
) => {
    const actualSels = actual.sel?.split(/\.|#/) || [];
    const expectedSels = expected.sel?.split(/\.|#/) || [];
    const isSubset = expectedSels.reduce(
        (acc, curr) => acc && actualSels.indexOf(curr) !== -1,
        true
    );

    if (!isSubset) throw SelectorMismatchedError(actual, expected, longError);
};

// TODO: WildCardText
export const assertNodeText: VNodeAssertion = (actual, expected, longError) => {
    if (actual.text !== expected.text)
        throw TextMismatchedError(actual, expected, longError);
};

// TODO: WildCardData
// TODO: exactly or is subset or ...
export const assertNodeData: VNodeAssertion = (actual, expected, longError) => {
    if (!matches(actual.data, expected.data))
        throw AttributesMismatchedError(actual, expected, longError);
};

const matches = (actual: any, expected: any): boolean => {
    if (expected === undefined) {
        return true;
    } else if (typeof expected !== typeof actual) {
        return false;
    } else if (typeof actual === 'object' && typeof expected === 'object') {
        for (let k in expected) {
            if (!matches(actual[k], expected[k])) {
                return false;
            }
        }
        return true;
    } else if (Array.isArray(expected) && Array.isArray(actual)) {
        if (expected.length !== actual.length) return false; // TODO: Subset does not match

        for (let i = 0; i < expected.length; i++) {
            if (!matches(actual[i], expected[i])) {
                return false;
            }
        }

        return true;
    }

    return actual === expected;
};
