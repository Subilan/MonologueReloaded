import type { TextInputField } from '@/models/form/elements/TextInput';
import type { Options } from '@/types/Options';

export const TextfieldTypes: Options<string, TextInputField['type']> = [
	{ label: '数字', value: 'number' },
	{ label: '文本', value: 'text' },
	{ label: '网址', value: 'url' },
	{ label: '电子邮箱', value: 'email' },
	{ label: '电话', value: 'tel' },
	{ label: '时间（时分秒）', value: 'time' },
	{ label: '整数', value: 'integer' },
	{ label: '密码', value: 'password' },
	{ label: '货币', value: 'currency' }
];
