import type { WithId } from '@/models/base/basic';

export interface TextInputCheck {
	r: string;
	error: string;
}

export interface TextInputField {
	type: 'number' | 'text' | 'url' | 'email' | 'tel' | 'time' | 'integer' | 'password' | 'date' | 'datetime-local' | 'month' | 'week' | 'currency' | '';
	max: number;
	min: number;
	minLength: number;
	maxLength: number;
	placeholder: string;
	label: string;
	autoComplete: 'off' | 'on';
	multiline: number;
	helperText: string;
	showCharacterCount: boolean;
	regex: TextInputCheck[];
}

export interface TextInput {
	fields: WithId<Partial<TextInputField>>[];
}
