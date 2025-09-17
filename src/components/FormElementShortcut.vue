<script setup lang="ts">
    import { InlineGrid, InlineStack, Tooltip } from '@ownego/polaris-vue';
    import Draggable from './Draggable.vue';
    import { ref, type PropType } from 'vue';
    import type { FormElementType } from '@/models/form/Form';
    import useFormElementDraggable from '@/composables/useFormElementDraggable';
    import VFragment from './ui/VFragment.vue';

    const props = defineProps({
        type: {
            type: String as PropType<FormElementType>,
            required: true
        },
        description: {
            type: String
        },
        onclick: {
            type: Function
        }
    });

    const draggable = useFormElementDraggable();
    const isDragging = ref(false);

    function handleShortcutClick() {
        if (isDragging.value || !props.onclick) return;
        props.onclick();
    }

    function handleDragStop() {
        setTimeout(() => {
            isDragging.value = false
        }, 1);
    }
</script>

<template>
    <Draggable no-cursor-change @drag="isDragging = true" @dragstop="handleDragStop" :disabled="!draggable" :data="type">
        <component :is="description ? Tooltip : VFragment" :content="description">
            <div @click="handleShortcutClick" class="form-element-shortcut">
                <InlineGrid columns="20px 2fr" gap="100">
                    <slot />
                </InlineGrid>
            </div>
        </component>
    </Draggable>
</template>

<style lang="scss">
.form-element-shortcut {
    border-radius: var(--p-border-radius-200);
    border: 1px solid var(--p-color-border);
    padding: 4px;
    background: var(--p-color-bg-surface);
    display: flex;
    justify-content: center;

    &:hover {
        background: var(--p-color-bg-surface-active);
    }

    .Polaris-Icon {
        width: 1rem;
        height: 1rem;
        pointer-events: none;
    }
}
</style>