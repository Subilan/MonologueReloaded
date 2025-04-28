import type { ParagraphInputTemplateConfiguration } from '@/models/form/ParagraphInput';

const numberChecker = (x: string) => /^\d+$/.test(x);
const availableAtrributes = ['type', 'min', 'max', 'minLength', 'maxLength'];
const attributeValueCheckers: { [prop: string]: (x: string) => boolean } = {
	type: x => /^(text|number)$/.test(x),
	min: numberChecker,
	max: numberChecker,
	minLength: numberChecker,
	maxLength: numberChecker
};

export function extractTemplateConfiguration(template: string) {
	return (template.match(/\[(.*?)\]/g) || []).map(x => x.substring(1, x.length - 1).split(',')).map(x => (x[0] === '' ? [] : x));
}

export function compileTemplateConfiguration(configuration: string[][]) {
	return configuration.map(x => {
		let res = {
			required: false,
			type: 'text',
			min: '',
			max: '',
			minLength: undefined,
			maxLength: undefined,
			r: undefined
		} as ParagraphInputTemplateConfiguration;

		if (x.length === 0) return res;

		for (let config of x) {
			if (config.includes('=')) {
				const equalConfig = config.split('=');

				if (equalConfig.length !== 2) {
					console.warn(`invalid equal config ${equalConfig}`);
					continue;
				}

				if (!availableAtrributes.includes(equalConfig[0])) {
					console.warn(`invalid equal config: invalid attribute ${equalConfig[0]}`);
					continue;
				}

				if (!attributeValueCheckers[equalConfig[0]](equalConfig[1])) {
					console.warn(`invalid equal config: attr value check failed for ${equalConfig[1]}`);
					continue;
				}
                
				res[equalConfig[0]] = equalConfig[1];
			}

			if (config === 'required') {
				res['required'] = true;
			}
		}

		return res;
	});
}
