<template>
    <VueDraggable :animation="150" :disabled="dragDisabled" ghost-class="phantom" v-model="formElements"
        class="builder-elements">
        <!-- @vue-ignore -->
        <component ref="formElementComponent" v-for="(obj, i) in formElements" :is="getComponent(obj.type)" :self="obj"
            :index="i + 1" :title="obj.title || 'default title'" :description="obj.description" />
    </VueDraggable>
</template>

<script lang="ts" setup>
    import { newElement, type FormElement, type FormElementType } from '@/models/form/Form';
    import Choice from '@/components/form-elements/Choice.vue';
    import Select from '@/components/form-elements/Select.vue';
    import Rating from '@/components/form-elements/Rating.vue';
    import Slider from '@/components/form-elements/Slider.vue';
    import TextInput from '@/components/form-elements/TextInput.vue';
    import ParagraphInput from '@/components/form-elements/ParagraphInput.vue';
    import { VueDraggable } from 'vue-draggable-plus';
    import useBus from '@/composables/useBus';
    import events, { type EventPayloadTypes } from '@/events';
    import { ref, useTemplateRef } from 'vue';
    import type { BoundingClientRect } from '@/types';
import getDefaultConfiguration from '@/func/form/getDefaultConfiguration';

    const props = defineProps({
        dragDisabled: {
            type: Boolean,
            default: false
        }
    })

    function getComponent(type: FormElementType) {
        switch (type) {
            case 'choice': return Choice;
            case 'select': return Select;
            case 'text_input': return TextInput;
            case 'paragraph_input': return ParagraphInput;
            case 'slider': return Slider;
            case 'rating': return Rating;
        }
    }

    const formElements = defineModel<FormElement[]>({
        required: true,
    });

    // 处理控件拖入

    const formElementComponentRef = useTemplateRef('formElementComponent');

    const dragAddEventBus = useBus(events.DRAGGABLE.channel);
    dragAddEventBus.on(events.DRAGGABLE.DRAG, handleBuilderComponentDrag);
    dragAddEventBus.on(events.DRAGGABLE.DRAGSTOP, handleBuilderComponentDragStop);

    const dragAddPosition = ref(-1);
    const dragAddTargetEl = ref<HTMLElement | null>(null);
    const dragAddType = ref<FormElementType | ''>('');

    function handleBuilderComponentDrag(payload: EventPayloadTypes['DRAGGABLE_DRAG']) {
        const refs = formElementComponentRef.value as any[];
        const refsMapped = refs.map((x, i) => {
            return {
                rect: x.$el.getBoundingClientRect(),
                el: x.$el,
                index: i
            }
        }) as {
            rect: BoundingClientRect,
            el: HTMLElement,
            index: number
        }[];

        /**
         * 清空所有元素的component-at-top/bottom
         */
        function clearActive() {
            refsMapped.forEach(x => {
                x.el.classList.remove('component-at-top');
                x.el.classList.remove('component-at-bottom');
            });
        }

        const within = refsMapped.filter(x => !(
            payload.right <= x.rect.left ||
            payload.left >= x.rect.right ||
            payload.bottom <= x.rect.top ||
            payload.top >= x.rect.bottom
        ));

        if (within.length !== 1) {
            // 无效，恢复初始状态
            dragAddPosition.value = -1;
            dragAddTargetEl.value = null;
            dragAddType.value = '';
            clearActive();
            return;
        }

        const targetComponent = within[0];

        const mid = (targetComponent.rect.top + targetComponent.rect.bottom) / 2;
        const overlapTop = Math.max(0, Math.min(payload.bottom, mid) - payload.top);
        const overlapBottom = Math.max(0, payload.bottom - Math.max(payload.top, mid));

        // 防止指针移动速度过快导致class位置不干净（有多个元素有component-at-top/bottom）
        clearActive();

        dragAddType.value = payload.data as FormElementType;

        if (overlapTop > overlapBottom) {
            targetComponent.el.classList.add('component-at-top');
            targetComponent.el.classList.remove('component-at-bottom')
            dragAddPosition.value = targetComponent.index;
        } else {
            targetComponent.el.classList.add('component-at-bottom');
            targetComponent.el.classList.remove('component-at-top');
            dragAddPosition.value = Math.min(targetComponent.index + 1, refs.length);
        }

        dragAddTargetEl.value = targetComponent.el;
    }

    function handleBuilderComponentDragStop() {
        if (!dragAddTargetEl.value || dragAddType.value == '') return;
        dragAddTargetEl.value.classList.remove('component-at-top');
        dragAddTargetEl.value.classList.remove('component-at-bottom');

        formElements.value.splice(dragAddPosition.value, 0, newElement(dragAddType.value, getDefaultConfiguration(dragAddType.value)))
        console.log(dragAddPosition.value, dragAddType.value);
    }
</script>

<style lang="scss" scoped>
.builder-elements {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.phantom {
    visibility: hidden;
}
</style>