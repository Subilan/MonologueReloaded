<script setup lang="ts">
    import { InlineStack } from '@ownego/polaris-vue';
    import Draggable from './Draggable.vue';
</script>

<template>
    <Draggable>
        <div class="form-element-shortcut">
            <InlineGrid columns="1fr 2fr" gap="200">
                <slot />
            </InlineGrid>
        </div>
    </Draggable>
</template>

<style lang="scss">
.form-element-shortcut {
    border-radius: var(--p-border-radius-200);
    border: 1px solid var(--p-color-border);
    padding: 4px;
    display: flex;
    justify-content: center;
    background: var(--p-color-bg-surface);

    &:hover {
        background: var(--p-color-bg-surface-active);
    }
}
</style>