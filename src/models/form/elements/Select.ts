import type { WithId } from '@/models/base/basic';

export interface Select {
	helperText?: string;
	options: WithId<{ label: string }>[];
}
