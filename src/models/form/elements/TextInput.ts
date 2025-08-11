
export interface TextInputCheck {
	r: RegExp;
	error: string;
}

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

export interface TextInputFields {
	type: 'number' | 'text' | 'search' | 'url' | 'email' | 'tel' | 'time' | 'integer' | 'password' | 'date' | 'datetime-local' | 'month' | 'week' | 'currency';
	max: number;
	min: number;
	maxLength: number;
	placeholder: string;
	label: string;
	autoComplete: 'off' | 'on';
	multiline: number;
	helperText: string;
	showCharacterCount: boolean;
}


export interface TextInput {
	checks: TextInputCheck[][];
	fields: PartialExcept<TextInputFields, 'autoComplete'>[];
}