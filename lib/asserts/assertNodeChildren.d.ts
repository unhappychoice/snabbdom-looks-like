import { VNode } from "snabbdom/vnode";
declare type VNodeAssertion = (actual: VNode, expected: VNode, longError: boolean) => void;
export declare const assertNodeChildren: VNodeAssertion;
export {};
