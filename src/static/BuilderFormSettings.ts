import type { NumberComponentConfiguration, NumberFormat } from '@/components/DisplayNumber.vue';
import type { Options } from '@/types/Options';

export const BFRequiredIndicatorStyles = ['badge', 'asterisk'] as const;
export type BFRequiredIndicatorStyle = (typeof BFRequiredIndicatorStyles)[number];
export const BFIndicatorStyleOptions: Options<string, BFRequiredIndicatorStyle> = [
	{
		label: '星号',
		value: 'asterisk'
	},
	{
		label: '标签',
		value: 'badge'
	}
];


export const BFIndexFormatOptions: Options<string, NumberFormat> = [
	{
		label: '罗马数字',
		value: 'roman'
	},
	{
		label: '阿拉伯数字',
		value: 'arabic'
	},
	{
		label: '英文字母',
		value: 'alphabet'
	},
	{
		label: '汉字',
		value: 'hanzi'
	},
];

export const BuilderFormSettingsDefault: BuilderFormSettings = {
	showIndex: true,
	boldTitle: true,
	requiredIndicatorStyle: 'asterisk',
	indexFormat: 'arabic',
	indexFormatConfig: {}
};

export default interface BuilderFormSettings {
	showIndex: boolean;
	boldTitle: boolean;
	requiredIndicatorStyle: BFRequiredIndicatorStyle;
	indexFormat: NumberFormat;
	indexFormatConfig: Partial<NumberComponentConfiguration['configuration']>;
}
