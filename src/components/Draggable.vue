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
    import draggingElement from '@/draggingElement';
    import { onMounted, reactive, ref, useTemplateRef, watch, type PropType } from 'vue';

    const props = defineProps({
        idx: {
            type: Number,
            default: -1
        }
    })

    const wrapper = useTemplateRef('draggable-wrapper');
    const current = reactive({ x: 0, y: 0 }); // where it is *now*
    const width = ref('auto');
    const height = ref('0px');
    const isDragging = ref(false);

    let initialX = 0;
    let initialY = 0;
    let offsetX = ref(0);
    let offsetY = ref(0);

    const bodyOriginalOverflowX = document.body.style.overflowX;

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

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.body.style.overflowX = bodyOriginalOverflowX;
    };

    function initCurrentXy() {
        current.x = initialX;
        current.y = initialY;
    }

    function recordLayoutParameters() {
        const boundingRect = wrapper.value?.getBoundingClientRect();
        if (!boundingRect) return;

        initialX = boundingRect.x;
        initialY = boundingRect.y;
    }

    onMounted(() => {
        width.value = wrapper.value?.clientWidth + 'px' || 'auto';
        height.value = wrapper.value?.clientHeight + 'px' || '0px';
        recordLayoutParameters();
        initCurrentXy();

        document.addEventListener('scroll', e => {
            recordLayoutParameters();
            initCurrentXy();
        })
    })

    watch(current, v => {
        if (!isDragging.value) return;
        draggingElement.isChanging = draggingElement.x !== v.x || draggingElement.y !== v.y;
        draggingElement.x = v.x;
        draggingElement.y = v.y;
    });

    watch(isDragging, v => {
        draggingElement.isDragging = v;
        if (v) draggingElement.id = props.idx;
        else draggingElement.id = -1;
    });
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