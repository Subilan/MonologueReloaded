import type { TextInputField } from '@/models/form/elements/TextInput';
import type { Options } from '@/types/Options';

export const TextfieldTypes: Options<string, TextInputField['type']> = [
	{ label: '数字', value: 'number' },
	{ label: '文本', value: 'text' },
	{ label: '网址', value: 'url' },
	{ label: '电子邮箱', value: 'email' },
	{ label: '电话', value: 'tel' },
	{ label: '时间', value: 'time' },
	{ label: '整数', value: 'integer' },
	{ label: '密码', value: 'password' },
	{ label: '日期', value: 'date' },
	{ label: '日期时间', value: 'datetime-local' },
	{ label: '月份', value: 'month' },
	{ label: '周', value: 'week' },
	{ label: '货币', value: 'currency' }
];
