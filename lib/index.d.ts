import { VNode } from 'snabbdom/vnode';
export { Wildcard } from './wildcard';
export declare function assertLooksLike(actual: VNode | string, expected: VNode | string, longError?: boolean): void;
export declare function looksLike(actual: VNode | string, expected: VNode | string): boolean;
