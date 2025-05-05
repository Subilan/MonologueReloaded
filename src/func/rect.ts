import type { RectObject } from "@/types";

export default class Rect {
	public x: number;
	public y: number;
	public w: number;
	public h: number;

	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	static withObject(rectObject: RectObject) {
		return new Rect(rectObject.x, rectObject.y, rectObject.w, rectObject.h);
	}

	public isIn(someRect: Rect) {

		return this.x >= someRect.x && this.y >= someRect.y && this.x <= someRect.x + someRect.w && this.y <= someRect.y + someRect.h;
	}
}
