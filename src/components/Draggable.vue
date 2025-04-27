<template>
    <div ref="draggable-wrapper" class="draggable-wrapper" @mousedown="startDrag" :style="isDragging ? {
        position: 'fixed',
        left: current.x + 'px',
        top: current.y + 'px',
        width: initial.width,
        opacity: '.7'
    } : {}">
        <slot />
    </div>
    <div background="bg-surface-trinary" class="dragged-away-skeleton" v-if="isDragging" :style="{
        height: initial.height
    }" />
</template>

<script lang="ts" setup>
    import { Card } from '@ownego/polaris-vue';
    import { onMounted, reactive, ref, useTemplateRef } from 'vue';

    const wrapper = useTemplateRef('draggable-wrapper');
    const current = reactive({ x: 0, y: 0 }); // where it is *now*
    const initial = reactive({
        x: 0,
        y: 0,
        width: 'auto',
        height: '0px'
    });
    const isDragging = ref(false);

    let offsetX = ref(0);
    let offsetY = ref(0);

    const startDrag = (e: MouseEvent) => {
        recordLayoutParameters();

        isDragging.value = true;

        offsetX.value = e.clientX - current.x;
        offsetY.value = e.clientY - current.y;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.body.style.overflowX = 'hidden';
    };

    const onDrag = (e: MouseEvent) => {
        if (isDragging.value) {
            current.x = e.clientX - offsetX.value;
            current.y = e.clientY - offsetY.value;
        }
    };

    const stopDrag = () => {
        isDragging.value = false;

        initCurrentXy();

        // Here you can check: is dropped inside a valid zone?
        // If not:
        // current.value = { ...initial.value };

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.body.style.overflowX = '';
    };

    function initCurrentXy() {
        current.x = initial.x;
        current.y = initial.y;
    }

    function recordLayoutParameters() {
        const boundingRect = wrapper.value?.getBoundingClientRect();
        if (boundingRect === null) return;

        initial.x = boundingRect?.left || 0;
        initial.y = boundingRect?.top || 0;
        initial.width = wrapper.value?.clientWidth + 'px' || 'auto';
        initial.height = wrapper.value?.clientHeight + 'px' || '0px';
    }

    onMounted(() => {
        recordLayoutParameters();
        initCurrentXy();
    })
</script>

<style lang="scss">
.draggable-wrapper {
    cursor: move;
    user-select: none;
    z-index: 100;
}

.dragged-away-skeleton {
    display: block;
    border-radius: var(--p-border-radius-200);
    border: 1px dashed var(--p-color-border-tertiary);
}
</style>