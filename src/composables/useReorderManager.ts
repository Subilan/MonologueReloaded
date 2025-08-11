import moveEl from '@/func/moveEl';
import type { FormElement } from '@/models/form/Form';
import { useEventBus } from '@vueuse/core';
import { reactive, ref, type Reactive, type Ref, type ShallowRef } from 'vue';

type MockFormElementComponent = {
	$el: {
		nextSibling: {
			getBoundingClientRect: () => { x: number; y: number; width: number; height: number; top: number; bottom: number; left: number; right: number };
		};
	};
	$props: {
		self: FormElement;
	};
};

/**
 * 创建一个表单组件排序管理器，主要提供的功能是监听某一个表单组件的拖拽并识别拖拽到的目标位置，给出相应的视觉提示，并实现表单组件的移动。
 * 
 * @param formElements 所有form element
 * @param isCandidate 用于记录目标位置form element的数组ref
 * @param isFirstCandidate 用于记录目标位置是否为第一个form element的变量ref
 * @param _formTemplateRefs 所有form element的模板ref
 * @returns 监听函数
 */
export default function (formElements: Reactive<FormElement[]>, isCandidate: Reactive<Record<string, boolean>>, isFirstCandidate: Ref<boolean>, _formTemplateRefs: Readonly<ShallowRef<any[] | null>>): {
	listen: () => void
} {
	const targetDirection = ref('');
	const targetIndexes = reactive({
		from: -1,
		to: -1
	});
	const bus = useEventBus<string>('draggable');
	const formTemplateRefs: Readonly<ShallowRef<MockFormElementComponent[] | null>> = _formTemplateRefs;

	function resetTargetIndexes() {
		targetIndexes.from = -1;
		targetIndexes.to = -1;
	}

	function resetCandidates(keys: string[] = []) {
		for (let key of keys.length > 0 ? keys : Object.keys(isCandidate)) isCandidate[key] = false;
		isFirstCandidate.value = false;
	}

	return {
		listen() {
			bus.on(event => {
				if (event != 'dragstop') return;

				if (targetIndexes.from === -1 || targetIndexes.to === -1) return;

				moveEl(formElements, targetIndexes.from, targetIndexes.to);

				resetTargetIndexes();
				resetCandidates();
			});

			bus.on(
				(
					event,
					args: {
						left: number;
						right: number;
						top: number;
						bottom: number;
						identifier: string;
						direction: 'up' | 'down';
					}
				) => {
					if (event !== 'drag') return;

					if (!formTemplateRefs.value) return;

					const res = formTemplateRefs.value
						.map(x => {
							if (!x?.$el)
								return {
									left: 0,
									right: 0,
									top: 0,
									bottom: 0,
									identifier: ''
								};

							const rect = x.$el.nextSibling.getBoundingClientRect();

							return {
								left: rect.left,
								right: rect.right,
								top: rect.top,
								bottom: rect.bottom,
								identifier: x.$props.self.identifier
							};
						})
						.filter(formObject => {
							return !(args.right < formObject.left || args.left > formObject.right || args.bottom < formObject.top || args.top > formObject.bottom) && formObject.identifier !== args.identifier;
						});

					if (res.length === 0) {
						resetCandidates();
						resetTargetIndexes();
					}

					const tg = res[args.direction === 'up' ? 0 : res.length - 1];

					if (!tg) return;

					if (!tg.identifier) return;

					targetIndexes.from = formElements.findIndex(x => x.identifier === args.identifier);
					targetIndexes.to = formElements.findIndex(x => x.identifier === tg.identifier);

					targetDirection.value = targetIndexes.to > targetIndexes.from ? 'down' : 'up';

					if (targetIndexes.to === 0) {
						isFirstCandidate.value = true;
						for (let key of Object.keys(isCandidate)) {
							isCandidate[key] = false;
						}
					} else {
						isFirstCandidate.value = false;
						for (let key of Object.keys(isCandidate)) {
							isCandidate[key] = targetIndexes.to > targetIndexes.from ? key === tg.identifier : key === formElements[Math.max(0, targetIndexes.to - 1)].identifier;
						}
					}
				}
			);
		}
	};
}
