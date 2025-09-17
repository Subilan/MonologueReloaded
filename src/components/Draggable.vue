<template>
    <div ref="draggable-wrapper" class="draggable-wrapper"
        :class="{ draggable: !disabled, dragging: isDragging, noCursorChange }" @mousedown="startDrag" :style="isDragging ? {
            left: current.x + 'px',
            top: current.y + 'px',
            width
        } : {}">
        <slot />
    </div>
    <div background="bg-surface-trinary" class="dashed-card" v-if="isDragging" :style="{
        height
    }" />
</template>

<script lang="ts" setup>
    import useBus from '@/composables/useBus';
    import events from '@/events';
    import { onMounted, reactive, ref, useTemplateRef } from 'vue';

    const props = defineProps({
        data: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        noCursorChange: {
            type: Boolean,
            default: false,
        }
    })

    const bus = useBus(events.DRAGGABLE.channel);

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
        if (props.disabled) return;

        recordRectXy();

        isDragging.value = true;

        offsetX.value = e.clientX - current.x;
        offsetY.value = e.clientY - current.y;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.body.style.overflowX = 'hidden';
    };

    const onDrag = (e: MouseEvent) => {
        if (props.disabled) return;

        emit('drag')

        if (isDragging.value) {
            const prevY = current.y;

            current.x = e.clientX - offsetX.value;
            current.y = e.clientY - offsetY.value;

            const rect = wrapper.value?.getBoundingClientRect();

            bus.send(events.DRAGGABLE.DRAG, {
                left: rect?.left || 0,
                right: rect?.right || 0,
                top: rect?.top || 0,
                bottom: rect?.bottom || 0,
                data: props.data,
                direction: current.y > prevY ? 'down' : 'up'
            });
        }
    };

    const stopDrag = () => {
        if (props.disabled) return;

        emit('dragstop')

        isDragging.value = false;

        bus.send(events.DRAGGABLE.DRAGSTOP)

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
    });

    const emit = defineEmits(['drag', 'dragstop'])
</script>

<style lang="scss">
.draggable-wrapper {
    user-select: none;

    &:not(.noCursorChange) {
        &:not(.draggable) {
            cursor: pointer;
        }

        &.draggable {
            cursor: move;
        }
    }

    &.dragging {
        position: fixed;
        opacity: .7;
        z-index: 200;
    }
}
</style>