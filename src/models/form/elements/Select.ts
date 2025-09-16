export interface SelectOption {
    label: string,
    value: string,
    helpText?: string
}

export interface Select {
	helperText?: string;
	options: SelectOption[];
}