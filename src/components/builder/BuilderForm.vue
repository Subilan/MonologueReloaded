<template>
    <div v-if="formElements.length">
        <vue-draggable @end="handleElementDrag" :animation="150" handle=".drag-handle" ghost-class="phantom"
            v-model="formElements" class="builder-elements">
            <!-- @vue-ignore -->
            <component :class="{ selected: formElementSelected[i] }" @click="() => handleElementClick(i)"
                ref="formElementComponent" v-for="(obj, i) in formElements" :is="getComponent(obj.type)" :self="obj"
                :index="settings.showIndex ? i + 1 : undefined" :title="obj.title || '无标题'"
                :description="obj.description" :required="obj.required" />
        </vue-draggable>

        <Box padding-block="400">
            <InlineStack align="center" gap="200">
                <Button variant="secondary" @click="modalAddAdvanced = true">高级添加</Button>
                <Button variant="primary" @click="modalAddNew = true">添加元素</Button>
            </InlineStack>
        </Box>
    </div>
    <div v-else>
        <DashedCard>
            <Empty heading="暂无表单元素" :action="{ content: '添加元素', onAction: () => modalAddNew = true }"
                :secondary-action="() => modalAddAdvanced = true" secondary-action-name="高级添加"
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
                <div class="element" v-for="type in groupTypes"
                    @click="appendEmptyFormElement(type); modalAddNew = false">
                    <div class="element-icon">
                        <Icon :source="FormElementInfo[type].icon" />
                    </div>
                    <div class="element-text">
                        <div class="name">
                            <Text variant="headingMd">{{ FormElementInfo[type].name }}</Text>
                        </div>
                        <div class="desc">{{ FormElementInfo[type].description }}</div>
                    </div>
                </div>
            </InlineGrid>
        </div>
    </Dlg>

    <Dlg v-model="modalAddAdvanced" title="高级添加" primary-action-name="执行"
        :primary-action-disabled="!modalAddAdvancedObjectValid">
        <FormLayout>
            <PolarisSelect v-model="modalAddAdvancedObject.type" label="题目类型"
                :options="FormElementOptions.concat(PleaseSelectOption)" />
            <RangeSlider v-model="modalAddAdvancedObject.count" :min="1" :max="50" :step="1"
                :suffix="`${modalAddAdvancedObject.count} 个`" label="题目数量" />
            <InlineGrid gap="400" columns="1fr auto">
                <TextField v-model="modalAddAdvancedObject.titleTemplate" placeholder="为每一个题目设置标题模板" auto-complete="off"
                    label="标题" help-text="可使用标题模板语法" />
                <Button variant="plain">模板语法</Button>
            </InlineGrid>
        </FormLayout>
        <template #footer v-if="modalAddAdvancedObjectValid && modalAddAdvancedObject.type !== ''">
            向表单末尾追加 {{ modalAddAdvancedObject.count }} 个{{ FormElementInfo[modalAddAdvancedObject.type].name }}
        </template>
    </Dlg>
</template>

<script lang="ts" setup>
import { FormElementGroupMap, FormElementInfo, FormElementOptions } from '@/static/FormElement';
import { newElement, type FormElement, type FormElementType } from '@/models/form/Form';
import Choice from '@/components/form-elements/Choice.vue';
import Select from '@/components/form-elements/Select.vue';
import { FormLayout, Select as PolarisSelect, TextField } from '@ownego/polaris-vue';
import Rating from '@/components/form-elements/Rating.vue';
import Slider from '@/components/form-elements/Slider.vue';
import TextInput from '@/components/form-elements/TextInput.vue';
import ParagraphInput from '@/components/form-elements/ParagraphInput.vue';
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus';
import useBus from '@/composables/useBus';
import events, { type EventPayloadTypes } from '@/events';
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import getDefaultConfiguration from '@/func/form/getDefaultConfiguration';
import DashedCard from '../DashedCard.vue';
import Empty from '../ui/Empty.vue';
import Dlg from '../ui/Dlg.vue';
import { Box, Button, Icon, InlineGrid, InlineStack, RangeSlider } from '@ownego/polaris-vue';
import CardSectionTitle from '../CardSectionTitle.vue';
import { PleaseSelectOption } from '@/static/Common';
import type { BoundingClientRect } from "@/types/BoundingClientRect.ts";
import useBuilderFormSettings from '@/composables/useBuilderFormSettings';

const settings = useBuilderFormSettings();

const modalAddNew = ref(false);
const modalAddAdvanced = ref(false);

const modalAddAdvancedObject = reactive({
    type: '' as FormElementType | '',
    count: 1,
    titleTemplate: '',
})
const modalAddAdvancedObjectValid = computed(() => modalAddAdvancedObject.type !== '' && modalAddAdvancedObject.count >= 1)

function getComponent(type: FormElementType) {
    switch (type) {
        case 'choice':
            return Choice;
        case 'select':
            return Select;
        case 'text_input':
            return TextInput;
        case 'paragraph_input':
            return ParagraphInput;
        case 'slider':
            return Slider;
        case 'rating':
            return Rating;
    }
}

const formElements = defineModel<FormElement[]>({
    required: true,
});

const formElementSelected = defineModel<Record<number, boolean>>('selection', { default: {} });
const formElementSelectedPrev = ref(-1);

function resetFormElementSelection() {
    // @ts-ignore
    Object.keys(formElementSelected.value).forEach(k => formElementSelected.value[k] = false);
}

function handleElementClick(index: number) {
    resetFormElementSelection();

    // 第二个条件是由于存在外部修改可能
    if (formElementSelectedPrev.value === index && formElementSelected.value[index] !== false) {
        formElementSelected.value[index] = false;
        formElementSelectedPrev.value = -1;
    } else {
        formElementSelected.value[index] = true;
        formElementSelectedPrev.value = index;
    }
}

// onMounted(() => {
//     document.addEventListener('click', e => {
//         const el = e.target as HTMLElement;
//         console.log(el)
//         if (!el.matches('.builder-elements *') && !el.matches('#element-configuration, #element-configuration *')) {
//             resetFormElementSelection();
//             formElementSelectedPrev.value = -1;
//         }
//     })
// })

// 处理新表单元素的拖入

const formElementComponentRef = useTemplateRef('formElementComponent');

const newComponentDragEventBus = useBus(events.DRAGGABLE.channel);
newComponentDragEventBus.on(events.DRAGGABLE.DRAG, handleNewComponentDrag);
newComponentDragEventBus.on(events.DRAGGABLE.DRAGSTOP, handleNewComponentDragStop);

const newComponentPosition = ref(-1);
const newComponentTargetEl = ref<HTMLElement | null>(null);
const newComponentType = ref<FormElementType | ''>('');

/**
 * 重置新表单元素的拖动状态
 */
function resetNewComponentDrag() {
    newComponentPosition.value = -1;
    newComponentTargetEl.value = null;
    newComponentType.value = '';
}

// 处理新的表单元素拖动到已有的表单元素上
function handleNewComponentDrag(payload: EventPayloadTypes['DRAGGABLE_DRAG']) {
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
        resetNewComponentDrag();
        clearActive();
        return;
    }

    const targetComponent = within[0];

    const mid = (targetComponent.rect.top + targetComponent.rect.bottom) / 2;
    const overlapTop = Math.max(0, Math.min(payload.bottom, mid) - payload.top);
    const overlapBottom = Math.max(0, payload.bottom - Math.max(payload.top, mid));

    // 防止指针移动速度过快导致class位置不干净（有多个元素有component-at-top/bottom）
    clearActive();

    newComponentType.value = payload.data as FormElementType;

    if (overlapTop > overlapBottom) {
        targetComponent.el.classList.add('component-at-top');
        targetComponent.el.classList.remove('component-at-bottom')
        newComponentPosition.value = targetComponent.index;
    } else {
        targetComponent.el.classList.add('component-at-bottom');
        targetComponent.el.classList.remove('component-at-top');
        newComponentPosition.value = Math.min(targetComponent.index + 1, refs.length);
    }

    newComponentTargetEl.value = targetComponent.el;
}

function handleNewComponentDragStop() {
    if (!newComponentTargetEl.value || newComponentType.value == '') return;

    newComponentTargetEl.value?.classList.remove('component-at-top');
    newComponentTargetEl.value?.classList.remove('component-at-bottom');

    formElements.value.splice(newComponentPosition.value, 0, newElement(newComponentType.value, getDefaultConfiguration(newComponentType.value)));
    resetNewComponentDrag();
}

function appendEmptyFormElement(type: FormElementType) {
    formElements.value.push(newElement(type, getDefaultConfiguration(type)));
}

defineExpose({
    appendEmptyFormElement
})

function handleElementDrag(e: SortableEvent) {
    if (e.oldIndex === undefined || e.newIndex === undefined) return;

    const oldIndex = e.oldIndex;
    const newIndex = e.newIndex;

    if (formElementSelected.value[oldIndex] === true) {
        formElementSelected.value[newIndex] = true;
        formElementSelected.value[oldIndex] = false;
        return;
    }

    // 判断是否移动的范围包含被选中的元素

    let containsSelected = false;
    let selectedIndex = -1;

    for (let i = Math.min(oldIndex, newIndex); i <= Math.max(oldIndex, newIndex); i++) {
        if (formElementSelected.value[i] === true) {
            selectedIndex = i;
            containsSelected = true;
            break;
        }
    }

    if (!containsSelected) return;

    let newSelectedIndex = -1;
    const newIdx = (newIndex > oldIndex) ? (newIndex - 1) : newIndex;
    const selectedAfterRemoval = (selectedIndex > oldIndex) ? (selectedIndex - 1) : selectedIndex;
    // 根据拖动的方向来判断
    newSelectedIndex = (newIndex < oldIndex ? (selectedAfterRemoval < newIdx) : (selectedAfterRemoval <= newIdx)) ? selectedAfterRemoval : (selectedAfterRemoval + 1);

    formElementSelected.value[selectedIndex] = false;
    formElementSelected.value[newSelectedIndex] = true;
}
</script>

<style lang="scss" scoped>
.builder-elements {
    display: flex;
    flex-direction: column;
    gap: 16px;
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