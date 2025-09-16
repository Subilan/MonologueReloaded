// import type { EventBusKey } from '@vueuse/core';

export type EventPayloadTypes = {
	DRAGGABLE_DRAG: {
		left: number;
		right: number;
		top: number;
		bottom: number;
		data: string;
		direction: 'up' | 'down';
	};
};

export type PayloadFor<K extends string = string> = K extends keyof EventPayloadTypes ? EventPayloadTypes[K] : string;

function e<K extends string, const Keys extends readonly string[]>(name: K, ...events: Keys) {
	return [name, Object.fromEntries([...events.map(e => [e, e]), ['channel', name]])] as [K, { [prop in Keys[number]]: prop } & { channel: K }];
}

function gather<K extends string, Ev>(...input: [K, Ev][]) {
	return Object.fromEntries(input) as Record<K, Ev>;
}

export default gather(e('DRAGGABLE', 'DRAG', 'DRAGSTOP'));
