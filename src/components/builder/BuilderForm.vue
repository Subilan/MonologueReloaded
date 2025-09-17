<template>
    <div v-if="formElements.length">
        <vue-draggable :animation="150" :disabled="dragDisabled" ghost-class="phantom" v-model="formElements"
            class="builder-elements">
            <!-- @vue-ignore -->
            <component ref="formElementComponent" v-for="(obj, i) in formElements" :is="getComponent(obj.type)"
                :self="obj" :index="i + 1" :title="obj.title || 'default title'" :description="obj.description" />
        </vue-draggable>
    </div>
    <div v-else>
        <DashedCard>
            <Empty heading="暂无表单元素" :action="{ content: '添加元素', onAction: () => modalAddNew = true }"
                image="/images/plus-circle-outline.svg">
                <p>该表单没有任何元素，请先添加</p>
            </Empty>
        </DashedCard>
    </div>

    <Dlg v-model="modalAddNew" title="添加表单元素">

        <div class="section" v-for="[groupName, groupTypes] in Object.entries(FormElementGroupMap)">
            <CardSectionTitle>
                {{ groupName }}
            </CardSectionTitle>
            <InlineGrid columns="1fr 1fr 1fr" gap="200">
                <div class="element" v-for="type in groupTypes">
                    <div class="element-icon">
                        <Icon :source="FormElementInfo[type].icon" />
                    </div>
                    <div class="element-text">
                        <div class="name"><Text variant="headingMd">{{ FormElementInfo[type].name }}</Text></div>
                        <div class="desc">{{ FormElementInfo[type].description }}</div>
                    </div>
                </div>
            </InlineGrid>
        </div>
    </Dlg>
</template>

<script lang="ts" setup>
    import { FormElementGroupMap, FormElementInfo } from '@/static/FormElement';
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
    import DashedCard from '../DashedCard.vue';
    import Empty from '../ui/Empty.vue';
    import Dlg from '../ui/Dlg.vue';
    import { Icon, InlineGrid } from '@ownego/polaris-vue';
    import CardSectionTitle from '../CardSectionTitle.vue';

    const modalAddNew = ref(false);

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

    // 处理新表单元素的拖入

    const formElementComponentRef = useTemplateRef('formElementComponent');

    const dragAddEventBus = useBus(events.DRAGGABLE.channel);
    dragAddEventBus.on(events.DRAGGABLE.DRAG, handleBuilderComponentDrag);
    dragAddEventBus.on(events.DRAGGABLE.DRAGSTOP, handleBuilderComponentDragStop);

    const dragAddPosition = ref(-1);
    const dragAddTargetEl = ref<HTMLElement | null>(null);
    const dragAddType = ref<FormElementType | ''>('');

    /**
     * 重置新表单元素的拖动状态
     */
    function resetDragAdd() {
        dragAddPosition.value = -1;
        dragAddTargetEl.value = null;
        dragAddType.value = '';
    }

    // 处理新的表单元素拖动到已有的表单元素上
    function handleBuilderComponentDrag(payload: EventPayloadTypes['DRAGGABLE_DRAG']) {
        const refs = formElementComponentRef.value as any[] | null;

        if (!refs) return;

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
            resetDragAdd();
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

        formElements.value.splice(dragAddPosition.value, 0, newElement(dragAddType.value, getDefaultConfiguration(dragAddType.value)));
        resetDragAdd();
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

.element {
    padding: 16px;
    cursor: pointer;
    border: 1px solid var(--p-color-border);
    border-radius: var(--p-border-radius-200);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &:hover {
        background: var(--p-color-bg-surface-hover);

        .element-icon .Polaris-Icon {
            opacity: 1;
        }
    }

    &:active {
        background: var(--p-color-bg-surface-active);
    }

    .element-icon .Polaris-Icon {
        width: 28px;
        height: 28px;
        opacity: .3;
    }

    .element-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        text-align: center;
        max-width: 80%;
    }
}
</style>