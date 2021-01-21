import { VNode } from 'snabbdom/vnode';
import {
    assertNodeChildren,
    assertNodeData,
    assertNodeType,
    assertNodeSelector,
    assertNodeText,
} from './asserts';
import { TexNodeMismatchedError } from './errors';

export { Wildcard } from './wildcard';

export function assertLooksLike(
    actual: VNode | string,
    expected: VNode | string,
    longError = false
): void {
    const valueType = assertNodeType(actual, expected, longError);

    switch (valueType) {
        case 'valid':
            return;
        case 'string': {
            if (actual !== expected)
                throw TexNodeMismatchedError(actual, expected, longError);
            break;
        }
        case 'object': {
            assertNodeSelector(actual as VNode, expected as VNode, longError);
            assertNodeText(actual as VNode, expected as VNode, longError);
            assertNodeData(actual as VNode, expected as VNode, longError);
            assertNodeChildren(actual as VNode, expected as VNode, longError);
            break;
        }
    }
}

export function looksLike(
    actual: VNode | string,
    expected: VNode | string
): boolean {
    try {
        assertLooksLike(actual, expected);
        return true;
    } catch (e) {
        return false;
    }
}
