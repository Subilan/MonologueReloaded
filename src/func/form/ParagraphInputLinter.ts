export interface ParagraphInputTemplateConfiguration {
	required: boolean;
	type: 'text' | 'number' | 'select';
	min: string;
	max: string;
	minLength?: string;
	maxLength?: string;
	options: string[];
}

export interface LintError {
	message: string;
	bracketIndex: number;
	start: number;
	end: number;
	token?: string;
	suggestion?: string;
}

export interface LintResult {
	valid: boolean;
	errors: LintError[];
	configurations?: ParagraphInputTemplateConfiguration[];
}

const numberChecker = (x: string) => /^\d+$/.test(x);
const availableAttributes = ['type', 'min', 'max', 'minLength', 'maxLength', 'options'];
const attributeValueCheckers: { [prop: string]: (x: string) => boolean } = {
	type: x => /^(text|number|select)$/.test(x),
	min: numberChecker,
	max: numberChecker,
	minLength: numberChecker,
	maxLength: numberChecker,
	options: x => true
};

const defaultObject: ParagraphInputTemplateConfiguration = {
	required: false,
	type: 'text',
	min: '',
	max: '',
	minLength: undefined,
	maxLength: undefined,
	options: []
};

/**
 * 将s按半角逗号分割，忽略{}内的半角逗号。
 * @param s 输入字符串
 * @returns 分割结果
 */
function splitCommaTopLevel(s: string): string[] {
	const res: string[] = [];
	let cur = '';
	let depth = 0;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (ch === '{') {
			depth++;
			cur += ch;
		} else if (ch === '}') {
			if (depth > 0) depth--;
			cur += ch;
		} else if (ch === ',' && depth === 0) {
			res.push(cur);
			cur = '';
		} else {
			cur += ch;
		}
	}
	if (cur !== '') res.push(cur);
	return res.map(x => x.trim());
}

/**
 * 将字符串按冒号分割，且忽略被转义的冒号（\:）以及单引号或双引号包围的冒号
 * @param s 输入字符串
 * @returns 分割结果
 */
function splitColon(s: string): string[] {
	const res: string[] = [];
	let cur = '';
	let inSingle = false;
	let inDouble = false;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (ch === '\\') {
			// escape next character, append it literally (if any)
			if (i + 1 < s.length) {
				cur += s[i + 1];
				i++;
				continue;
			} else {
				cur += ch; // trailing backslash
				continue;
			}
		}
		if (ch === "'" && !inDouble) {
			inSingle = !inSingle;
			cur += ch;
			continue;
		}
		if (ch === '"' && !inSingle) {
			inDouble = !inDouble;
			cur += ch;
			continue;
		}
		if (ch === ':' && !inSingle && !inDouble) {
			res.push(cur);
			cur = '';
			continue;
		}
		cur += ch;
	}
	if (cur !== '') res.push(cur);
	return res
		.map(x => x.trim())
		.filter(x => x.length > 0)
		.map(x => {
			const t = x.trim();
			if (t.length >= 2) {
				const a = t[0];
				const b = t[t.length - 1];
				if ((a === '"' && b === '"') || (a === "'" && b === "'")) {
					return t.slice(1, -1);
				}
			}
			return t;
		});
}

/**
 * 去掉字符串前后的单引号或双引号 
 * @param s 一个由引号引起来的字符串
 * @returns 去除引号之后的字符串
 */
function unquote(s: string): string {
	const trimmed = s.trim();
	if (trimmed.length >= 2) {
		const a = trimmed[0];
		const b = trimmed[trimmed.length - 1];
		if ((a === '"' && b === '"') || (a === "'" && b === "'")) return trimmed.slice(1, -1);
	}
	return trimmed;
}

/**
 * 将模板字符串中的每一个输入框的配置提取出来。
 * - 数组的第一维对应输入框的序号
 * - 数组的第二维对应该输入框的相关配置的序号。
 * @param template 模板字符串
 * @returns 经过处理的字符串
 */
export function extractTemplateConfiguration(template: string) {
	const re = /\[(.*?)\]/gs;
	const arr: string[][] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(template)) !== null) {
		const inner = m[1];
		if (inner.trim() === '') arr.push([]);
		else arr.push(splitCommaTopLevel(inner));
	}
	return arr;
}

/**
 * 将按照输入框划分的配置项数组解析为配置项对象数组
 * @param configuration 由配置项组成的数组，按照输入框划分
 * @returns 解析完毕的配置项对象数组
 */
export function compileTemplateConfiguration(configuration: string[][]) {
	return configuration.map(commaItems => {
    // 没有任何配置项，[]
		if (commaItems.length === 0) return structuredClone(defaultObject);

		let res = structuredClone(defaultObject) as ParagraphInputTemplateConfiguration;

		for (let commaItemRaw of commaItems) {
			const commaItem = commaItemRaw.trim();

      // 配置项是空的
			if (commaItem === '') continue;

      // 配置项包含赋值
			if (commaItem.includes('=')) {
				const equalIdx = commaItem.indexOf('=');
				const key = commaItem.substring(0, equalIdx).trim();
				const val = commaItem.substring(equalIdx + 1).trim();

				if (!availableAttributes.includes(key)) {
					console.warn(`invalid equal config: invalid attribute ${key}`);
					continue;
				}

				if (!attributeValueCheckers[key](val)) {
					console.warn(`invalid equal config: attr value check failed for ${key} "${val}"`);
					continue;
				}

				(res as any)[key] = val;
				continue;
			}

      // 配置项包含 required
			if (commaItem === 'required') {
				res['required'] = true;
				continue;
			}

      // 配置项为options
			if (commaItem.startsWith('options{') && commaItem.endsWith('}')) {
				const match = commaItem.match(/^options{([\s\S]*)}$/);

				if (match === null) {
					console.warn(`invalid option: ${commaItem}`);
					continue;
				}

				const rawOptions = match[1];
				const optionItems = splitColon(rawOptions).map(x => unquote(x));
				res.options = [...optionItems];
				continue;
			}

			console.warn(`unknown token ignored: ${commaItem}`);
		}
		return res;
	});
}

/**
 * 分析模板字符串，检查是否符合语法约束；如果不符合，给出原因和第一个出错的位置。
 * @param template 模板字符串
 * @returns 分析结果
 */
export function lintTemplate(template: string): LintResult {
	const errors: LintError[] = [];

	const re = /\[(.*?)\]/gs;

	let m: RegExpExecArray | null;

	let bracketIndex = 0;

	const compiledConfigs: ParagraphInputTemplateConfiguration[] = [];

	while ((m = re.exec(template)) !== null) {
		const inner = m[1];
		const matchStart = m.index;
		const contentStart = matchStart + 1;

		if (inner.trim() === '') {
			compiledConfigs.push(structuredClone(defaultObject));
			bracketIndex++;
			continue;
		}

		const tokens = splitCommaTopLevel(inner);

		const seenAttrs = new Set<string>();

		let cursor = 0;

		for (let token of tokens) {
			const raw = token;
			const tokenTrimmed = token.trim();
			const idx = inner.indexOf(raw, cursor);
			const tokenStart = idx >= 0 ? contentStart + idx : contentStart + cursor;
			const tokenEnd = tokenStart + raw.length;

			cursor = idx >= 0 ? idx + raw.length : cursor + raw.length;

			if (tokenTrimmed === '') continue;

			if (tokenTrimmed.includes('=')) {
				const equalCount = (tokenTrimmed.match(/=/g) || []).length;

				if (equalCount !== 1) {
					errors.push({ message: `invalid '=' usage: must contain exactly one '='`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `use single '=' as in type=text` });
					continue;
				}

				const equalIdx = tokenTrimmed.indexOf('=');
				const key = tokenTrimmed.substring(0, equalIdx).trim();
				const val = tokenTrimmed.substring(equalIdx + 1).trim();

				if (!availableAttributes.includes(key)) {
					errors.push({ message: `invalid attribute name '${key}'`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `allowed attributes: ${availableAttributes.join(', ')}` });
					continue;
				}

				if (seenAttrs.has(key)) {
					errors.push({ message: `duplicate attribute '${key}' in same brackets`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `remove duplicate or combine values` });
				}

				if (!attributeValueCheckers[key](val)) {
					errors.push({ message: `invalid value for attribute '${key}': "${val}"`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `value should match expected pattern for ${key}` });
					continue;
				}
        
				seenAttrs.add(key);
				continue;
			}

			if (tokenTrimmed === 'required') {
				continue;
			}

			if (tokenTrimmed.startsWith('options{') && tokenTrimmed.endsWith('}')) {
				const match = tokenTrimmed.match(/^options{([\s\S]*)}$/);

				if (!match) {
					errors.push({ message: `invalid options syntax`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `use options{a:b:c} with colon-separated items` });
					continue;
				}

				const innerOptions = match[1];
				const optionItems = splitColon(innerOptions);

				if (optionItems.length === 0) {
					errors.push({ message: `options empty`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `provide at least one option: options{apple:banana}` });
					continue;
				}

				continue;
			}
			errors.push({ message: `unknown token '${tokenTrimmed}'`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `expected attribute assignment like type=text, 'required', or options{...}` });
		}

		const hasOptionsToken = tokens.some(t => t.trim().startsWith('options{'));

		if (hasOptionsToken) {
			const hasTypeSelect = tokens.some(t => {
				const tx = t.trim();
				if (tx.includes('=')) {
					const [k, v] = tx.split('=');
					return k.trim() === 'type' && v && v.trim() === 'select';
				}
				return false;
			});

			if (!hasTypeSelect) {
				for (let token of tokens) {
					const raw = token;
					if (raw.trim().startsWith('options{')) {
						const idx = inner.indexOf(raw);
						const tokenStart = contentStart + (idx >= 0 ? idx : 0);
						const tokenEnd = tokenStart + raw.length;
						errors.push({ message: `options used without type=select`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `add type=select in the same brackets to use options` });
					}
				}
			}
		}

		const hasTypeSelect = tokens.some(t => {
			const tx = t.trim();
			if (tx.includes('=')) {
				const [k, v] = tx.split('=');
				return k.trim() === 'type' && v && v.trim() === 'select';
			}
			return false;
		});

		const hasOptions = tokens.some(t => t.trim().startsWith('options{'));

		if (hasTypeSelect && !hasOptions) {
			for (let token of tokens) {
				const raw = token;
				const tx = raw.trim();
				if (tx.includes('=')) {
					const [k, v] = tx.split('=');
					if (k.trim() === 'type' && v && v.trim() === 'select') {
						const idx = inner.indexOf(raw);
						const tokenStart = contentStart + (idx >= 0 ? idx : 0);
						const tokenEnd = tokenStart + raw.length;
						errors.push({ message: `type=select specified but no options provided`, bracketIndex, start: tokenStart, end: tokenEnd, token: raw, suggestion: `add options{...} to supply select choices` });
					}
				}
			}
		}

		const bracketErrors = errors.filter(e => e.bracketIndex === bracketIndex);

		if (bracketErrors.length === 0) {
			const conf = compileTemplateConfiguration([tokens])[0];
			compiledConfigs.push(conf);
		}

		bracketIndex++;
	}

	const valid = errors.length === 0;

	const result: LintResult = { valid, errors };

	if (valid) result.configurations = compiledConfigs;
  
	return result;
}
