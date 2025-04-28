import type { ParagraphInputTemplateConfiguration } from '@/models/form/ParagraphInput';

const numberChecker = (x: string) => /^\d+$/.test(x);
const availableAtrributes = ['type', 'min', 'max', 'minLength', 'maxLength', 'options'];
const attributeValueCheckers: { [prop: string]: (x: string) => boolean } = {
	type: x => /^(text|number|select)$/.test(x),
	min: numberChecker,
	max: numberChecker,
	minLength: numberChecker,
	maxLength: numberChecker,
	options: x => true
};

const defaultObject = {
	required: false,
	type: 'text',
	min: '',
	max: '',
	minLength: undefined,
	maxLength: undefined,
	options: []
} as ParagraphInputTemplateConfiguration;

export function extractTemplateConfiguration(template: string) {
	return (template.match(/\[(.*?)\]/g) || []).map(x => x.substring(1, x.length - 1).split(',')).map(x => (x[0] === '' ? [] : x));
}

export function compileTemplateConfiguration(configuration: string[][]) {
	return configuration.map(commaItems => {
		if (commaItems.length === 0) return defaultObject;

		let res = structuredClone(defaultObject);

		for (let commaItem of commaItems) {
			if (commaItem.includes('=')) {
				const equalConfig = commaItem.split('=');

				if (equalConfig.length !== 2) {
					console.warn(`invalid equal config ${equalConfig}`);
					continue;
				}

                // check attr name
				if (!availableAtrributes.includes(equalConfig[0])) {
					console.warn(`invalid equal config: invalid attribute ${equalConfig[0]}`);
					continue;
				}

                // check attr values
				if (!attributeValueCheckers[equalConfig[0]](equalConfig[1])) {
					console.warn(`invalid equal config: attr value check failed for ${equalConfig[0]} "${equalConfig[1]}"`);
					continue;
				}

				res[equalConfig[0]] = equalConfig[1];
			}

			if (commaItem === 'required') {
				res['required'] = true;
			}

			console.log(res['type']);

            // extract options
			if (commaItem.startsWith('options{') && commaItem.endsWith('}') && res['type'] === 'select') {
				const match = commaItem.match(/^options{(.*?)}$/);
				if (match === null) {
					console.warn(`invalid option: ${commaItem}`);
					return defaultObject;
				}

                // string resolution
				const optionItems = match[1].split(':').map(x => {
					const stringRes = [x.match(/^"(.*)"$/), x.match(/^'(.*)'$/)].filter(y => y !== null).map(y => y[1]);
                    if (stringRes.length > 0) return stringRes[0];
                    return x;
				});

				res.options = [...optionItems];
			}
		}

		return res;
	});
}
