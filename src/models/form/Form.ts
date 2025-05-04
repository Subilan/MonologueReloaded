import type { ChoiceOption } from './elements/Choice';
import type { SelectOption } from './elements/Select';
import type { PartialExcept, TextInputCheck, TextInputConfig } from './elements/TextInput';

const FormElementTypes = ['choice', 'select', 'text_input', 'paragraph_input', 'slider', 'rating'] as const;
export type FormElementType = typeof FormElementTypes[number];

export namespace FormElements {
	export type Object = ChoiceObject | SelectObject | TextInputObject | SliderObject | RatingObject | ParagraphInputObject;

	export interface ResultBase {
		valid: boolean
	}

	export interface SimpleResult<T> extends ResultBase {
		value: T
	}

	interface Base {
		type: FormElementType;
		description?: string;
		title?: string;
	}

	export interface ChoiceObject extends Base {
		isMultiple: boolean;
		hasOther: boolean;
		otherLabel?: string;
		choices: ChoiceOption[];
		type: 'choice';
	}

	export interface SelectObject extends Base {
		helperText?: string;
		options: SelectOption[];
		type: 'select';
	}

	export interface ParagraphInputObject extends Base {
		template: string;
		type: 'paragraph_input';
	}

	export interface TextInputObject extends Base {
		checks: TextInputCheck[][];
		configs: PartialExcept<TextInputConfig, 'autoComplete'>[];
		type: 'text_input';
	}

	export interface SliderObject extends Base {
		minValue?: number;
		maxValue?: number;
		step?: number;
		prefix?: string;
		suffix?: string;
		isRange?: boolean;
		output?: boolean;
		label?: string;
		type: 'slider';
	}

	export interface RatingObject extends Base {
		levels: number;
		ratingMessages: string[];
		type: 'rating';
	}
}
