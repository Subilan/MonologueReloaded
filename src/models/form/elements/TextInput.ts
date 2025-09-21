import type { WithId } from '@/models/base/basic';

export interface TextInputCheck {
	r: string;
	error: string;
}

export type TextInputType = 'number' | 'text' | 'url' | 'email' | 'tel' | 'time' | 'integer' | 'password' | 'currency';

export type TextInputTypeRegexPreset = Exclude<TextInputType, 'text' | 'password'>;

export interface TextInputField {
	type: TextInputType | '';
	max: number;
	min: number;
	minLength: number;
	maxLength: number;
	placeholder: string;
	label: string;
	autoComplete: 'off' | 'on';w
	multiline: number;
	helperText: string;
	showCharacterCount: boolean;
	regex: WithId<TextInputCheck>[];
	required: boolean;
}

export interface TextInput {
	fields: WithId<Partial<TextInputField>>[];
}
