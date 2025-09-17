import { IconDropdown, IconMultipleChoice, IconParagraphInput, IconSlider, IconStar, IconTextInput } from '@/icons';
import type { FormElementType } from '@/models/form/Form';
import type {Options} from "@/types/Options.ts";

type FormElementInfo = Record<
	FormElementType,
	{
		name: string;
		icon: string;
		description: string;
	}
>;

export const FormElementGroups = {
	CHOICES: '选择',
	BLANKS: '填空',
	EVALUATION: '评估',
	UNKNOWN: '未知'
};

export const FormElementGroupMap: Record<string, FormElementType[]> = {
	[FormElementGroups.CHOICES]: ['choice', 'select'],
	[FormElementGroups.BLANKS]: ['paragraph_input', 'text_input'],
	[FormElementGroups.EVALUATION]: ['rating', 'slider']
};

export const FormElementInfo: FormElementInfo = {
	choice: {
		name: '选择',
		icon: IconMultipleChoice,
		description: '单项选择或多项选择'
	},
	select: {
		name: '下拉',
		icon: IconDropdown,
		description: '以下拉框选项的形式呈现选择题'
	},
	text_input: {
		name: '填空',
		icon: IconTextInput,
		description: '提供一个或多个输入框进行填写'
	},
	paragraph_input: {
		name: '段落填空',
		icon: IconParagraphInput,
		description: '在预编写的段落中插入输入框'
	},
	slider: {
		name: '滑块',
		icon: IconSlider,
		description: '滑动提供不同离散程度的数值'
	},
	rating: {
		name: '评分',
		icon: IconStar,
		description: '按照预定义的等级给出评分'
	},
	unknown: {
		name: '未知',
		icon: '',
		description: ''
	}
};

export const FormElementOptions = Object.entries(FormElementInfo).map(([type, value]) => {
	return {
		label: value.name,
		value: type
	};
}).filter(x => x.value !== 'unknown') as Options;
