import type { Dictionary } from "@/types";
import type { ResultBase } from "../Form";

export interface ParagraphInputResult extends ResultBase {
	content: string;
	values: string[];
}

export interface ParagraphInputTemplateConfiguration extends Record<string, any> {
	required: boolean;
	type: 'text' | 'number' | 'select';
	min: number | '';
	max: number | '';
	minLength?: number;
	maxLength?: number;
	options?: string[];
}

export interface ParagraphInput {
	template: string;
}