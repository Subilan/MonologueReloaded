export type Feedback<Good = null, Bad = string> = Promise<{ ok: true; data: Good } | { ok: false; data: Bad }>;

export type Tone = 'warning' | 'critical' | 'success' | 'info';

export type RectObject = {
	x: number;
	y: number;
	w: number;
	h: number;
	id?: number;
};

export type BoundingClientRect = {
	bottom: number;
	height: number;
	left: number;
	right: number;
	top: number;
	width: number;
	x: number;
	y: number;
};
