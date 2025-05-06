<template>
    <div ref="draggable-wrapper" class="draggable-wrapper" :class="{ dragging: isDragging }" @mousedown="startDrag"
        :style="isDragging ? {
            left: current.x + 'px',
            top: current.y + 'px',
            width
        } : {}">
        <slot />
    </div>
    <div background="bg-surface-trinary" class="dragged-away-skeleton" v-if="isDragging" :style="{
        height
    }" />
</template>

<script lang="ts" setup>
    import { useEventBus } from '@vueuse/core';
    import { onMounted, reactive, ref, useTemplateRef } from 'vue';

    const props = defineProps({
        identifier: {
            type: String,
            default: ''
        }
    })

    const bus = useEventBus<string>('draggable');

    const wrapper = useTemplateRef('draggable-wrapper');
    const current = reactive({ x: 0, y: 0 }); // where it is *now*
    const width = ref('auto');
    const height = ref('0px');
    const isDragging = ref(false);

    let widthVal = 0;
    let heightVal = 0;
    let initialX = 0;
    let initialY = 0;
    let offsetX = ref(0);
    let offsetY = ref(0);

    const bodyOriginalOverflowX = document.body.style.overflowX;

    const startDrag = (e: MouseEvent) => {
        recordRectXy();

        isDragging.value = true;

        offsetX.value = e.clientX - current.x;
        offsetY.value = e.clientY - current.y;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.body.style.overflowX = 'hidden';
    };

    const onDrag = (e: MouseEvent) => {
        if (isDragging.value) {
            const prevY = current.y;
            
            current.x = e.clientX - offsetX.value;
            current.y = e.clientY - offsetY.value;

            const rect = wrapper.value?.getBoundingClientRect();

            bus.emit('drag', {
                left: rect?.left || 0,
                right: rect?.right || 0,
                top: rect?.top || 0,
                bottom: rect?.bottom || 0,
                identifier: props.identifier,
                direction: current.y > prevY ? 'down' : 'up'
            });
        }
    };

    const stopDrag = () => {
        isDragging.value = false;

        bus.emit('dragstop')

        setPositionXy();

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.body.style.overflowX = bodyOriginalOverflowX;
    };

    function setPositionXy() {
        current.x = initialX;
        current.y = initialY;
    }

    function recordRectXy() {
        const boundingRect = wrapper.value?.getBoundingClientRect();
        if (!boundingRect) return;

        initialX = boundingRect.x;
        initialY = boundingRect.y;
    }

    onMounted(() => {
        width.value = wrapper.value?.clientWidth + 'px' || 'auto';
        height.value = wrapper.value?.clientHeight + 'px' || '0px';
        widthVal = wrapper.value?.clientWidth || 0;
        heightVal = wrapper.value?.clientHeight || 0;
        recordRectXy();
        setPositionXy();

        document.addEventListener('scroll', e => {
            recordRectXy();
            setPositionXy();
        })
    })
</script>

<style lang="scss">
.draggable-wrapper {
    cursor: move;
    user-select: none;

    &.dragging {
        position: fixed;
        opacity: .7;
        z-index: 200;
    }
}

.dragged-away-skeleton {
    display: block;
    border-radius: var(--p-border-radius-200);
    border: 1px dashed var(--p-color-border-tertiary);
}
</style>