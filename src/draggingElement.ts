import { reactive, ref } from 'vue';

export default reactive({
	x: 0,
	y: 0,
	isDragging: false,
	isChanging: false,
	id: -1
});
