import type { Dictionary } from "@/types";

export interface ParagraphInputResult {
	content: string;
	values: string[];
	valid: boolean;
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
