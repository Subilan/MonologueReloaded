import { v4 } from 'uuid';
import type { Choice } from './elements/Choice';
import type { ParagraphInput } from './elements/ParagraphInput';
import type { Rating } from './elements/Rating';
import type { Select } from './elements/Select';
import type { Slider } from './elements/Slider';
import type { TextInput } from './elements/TextInput';

const FormElementTypes = ['choice', 'select', 'text_input', 'paragraph_input', 'slider', 'rating', 'unknown'] as const;
export type FormElementType = (typeof FormElementTypes)[number];

export interface ResultBase {
	valid: boolean;
}

export interface SimpleResult<T> extends ResultBase {
	value: T;
}

export type FormElementBase = {
	description: string;
	title: string;
	identifier: string;
	required: boolean;
};

// Type字段字面值与FormElement映射
export interface FormElementTypeMap {
	choice: Choice;
	select: Select;
	text_input: TextInput;
	paragraph_input: ParagraphInput;
	slider: Slider;
	rating: Rating;
	unknown: Object;
}

export type FormElement<T extends FormElementType = FormElementType> = FormElementBase & { type: T; config: FormElementTypeMap[T] };
export type FormEl<T extends FormElementType = FormElementType> = FormElement<T>; // alias

export function newElement<T extends FormElementType>(type: T, config: FormElementTypeMap[T], title = '', description = '') {
	return {
		type,
		config,
		description,
		title,
		required: true,
		identifier: v4()
	} as FormElement<T>;
}
