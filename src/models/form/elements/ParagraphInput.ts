import type { Dictionary } from "@/types";
import type { FormElements } from "../Form";

export interface ParagraphInputResult extends FormElements.ResultBase {
	content: string;
	values: string[];
}

export interface ParagraphInputTemplateConfiguration extends Dictionary<any> {
	required: boolean;
	type: 'text' | 'number' | 'select';
	min: number | '';
	max: number | '';
	minLength?: number;
	maxLength?: number;
	options?: string[];
}
