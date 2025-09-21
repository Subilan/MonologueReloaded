import { expect, test } from 'vitest';
import { TextfieldRegexPreset } from '../TextfieldRegexPreset';

const validExamples = {
	number: ['123', '-45.67', '0.5'],
	url: ['http://example.com', 'https://www.test.org/path'],
	email: ['user@example.com', 'my.name+tag@sub.domain.co'],
	tel: ['+1 123-456-7890', '+86 13800138000', '+86 021-88886666', '+81 42-632-8510', '+852 800 123-456'],
	time: ['00:00', '23:59', '12:30:45'],
	integer: ['0', '-42', '1024'],
	currency: ['$100', '¥45.50', 'USD 0.99', 'JPY 500', 'HKD 25']
};

const invalidExamples = {
	number: ['12,34', '123abc', '1.2.3', '', 'NaN', '.5'],
	url: ['http:/bad.com', 'ftp://test.com', '://missing.com', 'http//no-colon.com'],
	email: ['user@@example.com', 'userexample.com', 'user@.com', '@example.com', 'user@domain'],
	tel: ['+1', '', 'abc', '+86', '12345678', '+853'],
	time: ['24:00', '12:60', '99:99', '12:30:99', '7:5'],
	integer: ['12.5', 'abc', '1 2 3', '', '3.0', '.3', '3.'],
	currency: ['12.345', 'abc', '--12.00', '12,34', '¥-123', 'JP¥ 50']
};

test('Valid example - Regex preset for different types of textfields', () => {
	Object.entries(validExamples).forEach(([type, values]) => {
		values.forEach(v => {
			expect(TextfieldRegexPreset[type].test(v), `${v} should pass ${type} test`).toBe(true);
		});
	});
});

test('Invalid example - Regex preset for different types of textfields', () => {
	Object.entries(invalidExamples).forEach(([type, values]) => {
		values.forEach(v => {
			expect(TextfieldRegexPreset[type].test(v), `${v} should not pass ${type} test`).toBe(false);
		});
	});
});
