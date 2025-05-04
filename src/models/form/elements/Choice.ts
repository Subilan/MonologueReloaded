import type { VNode } from "vue";
import type { FormElements } from "../Form";

export interface ChoiceOption {
    label: string,
    value: string,
    helpText?: string,
    renderChildren?: VNode | false
};

export interface ChoiceResult extends FormElements.ResultBase {
    selection: string[],
    otherValue: string
}