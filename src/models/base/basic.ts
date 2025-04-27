import regions from './regions';

// https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export namespace Model {
	export type Gender = 'M' | 'F' | 'O' | 'U';
	export type Region = (typeof regions)[number];
	export type Age = IntRange<0, 120>;
}
