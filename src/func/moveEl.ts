export default function moveEl<T>(arr: T[], fromIndex: number, toIndex: number) {
	const [element] = arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}