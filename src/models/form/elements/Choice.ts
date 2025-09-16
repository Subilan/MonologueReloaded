import type { VNode } from 'vue';
import type { ResultBase } from '../Form';

export interface ChoiceOption {
	label: string;
	value: string;
	helpText?: string;
	renderChildren?: VNode | false;
}

export interface ChoiceResult extends ResultBase {
	selection: string[];
	otherValue: string;
}

export interface Choice {
	isMultiple: boolean;
	hasOther: boolean;
	otherLabel?: string;
	choices: ChoiceOption[];
}
