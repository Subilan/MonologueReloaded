<script setup lang="ts">
    import { EmptyState } from '@ownego/polaris-vue';
    import type { PropType } from 'vue';

    const props = defineProps({
        primaryActionName: {
            type: String
        },
        primaryAction: {
            type: Function as PropType<() => void>
        },
        secondaryActionName: {
            type: String
        },
        secondaryAction: {
            type: Function as PropType<() => void>
        },
        heading: {
            type: String
        },
        image: {
            type: String
        },
        noPadding: {
            type: Boolean,
            default: false
        },
        primaryActionDisabled: {
            type: Boolean,
            default: false,
        },
        hideIcon: {
            type: Boolean,
            default: false,
        }
    })
</script>

<template>
    <EmptyState :class="{ noPadding }" class="emptystate__custom" :image="hideIcon ? '' : (image ? image : '/images/file-hidden.png')"
        :image-contained="!hideIcon" :heading="heading" :action="primaryActionName ? {
            content: primaryActionName,
            onAction: primaryAction,
            disabled: primaryActionDisabled
        } : undefined" :secondary-action="secondaryActionName ? {
            content: secondaryActionName,
            onAction: secondaryAction
        } : undefined">
        <slot />
    </EmptyState>
</template>

<style lang="scss">
.Polaris-EmptyState__Image.Polaris-EmptyState--loaded {
    width: 100px;
    padding: 5px;
    margin-bottom: 16px;
    opacity: .2;
}

.emptystate__custom {
    padding: 24px 0;

    &.noPadding {
        padding: 0;
    }

    // border: 1px dashed #ccc;
    // border-radius: 10px;
}
</style>