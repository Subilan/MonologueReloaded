import type { PayloadFor } from '@/events';
import { useEventBus } from '@vueuse/core';

export default function <K extends string = string>(channel: K) {
	const bus = useEventBus<string>(channel);
	return {
		send: <const S extends string = string>(event: S, args?: PayloadFor<`${K}_${S}`>) => {
			bus.emit(event, args);
		},
		on: <const S extends string = string>(event: S, listener: (r: PayloadFor<`${K}_${S}`>) => void) => {
			bus.on((e, payload) => {
				if (e !== event) return;

				listener(payload);
			});
		}
	};
}
