import type { FormElementType, FormElementTypeMap } from '@/models/form/Form';

const map: FormElementTypeMap = {
	choice: {
		isMultiple: false,
		hasOther: false,
		choices: []
	},
	select: {
		options: []
	},
	text_input: {
		checks: [],
		fields: []
	},
	paragraph_input: {
		template: ''
	},
	slider: {},
	rating: {
		levels: 0,
		ratingMessages: []
	},
	unknown: {}
};

export default function <T extends FormElementType>(type: T): FormElementTypeMap[T] {
	return map[type];
}
