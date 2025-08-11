export interface Slider {
	minValue?: number;
	maxValue?: number;
	step?: number;
	prefix?: string;
	suffix?: string;
	isRange?: boolean;
	output?: boolean;
	label?: string;
}