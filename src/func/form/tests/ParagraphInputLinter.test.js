import { lintTemplate } from '../ParagraphInputLinter';
import { expect, test } from 'vitest';

test('Working template', () => {
	const template = "Hello, my name is [type=text,required] and I am from [], I'm [type=number,min=1,max=120,required]. My favorite food is [type=select,options{apple:'orange juice':'bla bla bla'}] and my favorite singer is [].";
	const res = lintTemplate(template);
	expect(res.valid, `${template} should pass`).toBeTruthy();
});

test('Not working template', () => {
	const template = "Hello, my name is [type=text] and I am from [], I'm [type=number,min=-1,max=120,require]. My favorite food is [type=select,options{apple:'orange juice':'bla bla bla'}] and my favorite singer is [].";
	const res = lintTemplate(template);
	expect(res.valid, `${template} should not pass`).toBeFalsy();
});

test('Escaping `:`', () => {
	const template = "[type=select, options{'a:b':a:b:a\\:b}]";
	const res = lintTemplate(template);
	expect(res.configurations[0].options[0] === res.configurations[0].options[3]).toBeTruthy();
});
