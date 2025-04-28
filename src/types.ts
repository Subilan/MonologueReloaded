export type Feedback<Good = null, Bad = string> = Promise<{ ok: true; data: Good } | { ok: false; data: Bad }>;

export type Tone = 'warning' | 'critical' | 'success' | 'info';

export type Dictionary<T> = { [props: string]: T };
