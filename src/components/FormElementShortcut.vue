<script setup lang="ts">
    import { InlineGrid, InlineStack } from '@ownego/polaris-vue';
    import Draggable from './Draggable.vue';
</script>

<template>
    <Draggable>
        <div class="form-element-shortcut">
            <InlineGrid columns="20px 2fr" gap="100">
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
    background: var(--p-color-bg-surface);
    display: flex;
    justify-content: center;

    &:hover {
        background: var(--p-color-bg-surface-active);
    }

    .Polaris-Icon {
        width: 1rem;
        height: 1rem;
    }
}
</style>