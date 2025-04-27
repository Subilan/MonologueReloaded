import type { VNode } from "vue";

export interface ChoiceOption {
    label: string,
    value: string,
    helpText?: string,
    renderChildren?: VNode | false
};

export interface ChoiceResult {
    selection: string[],
    otherValue: string
}