<script setup lang="ts">
    import { Box, Modal } from '@ownego/polaris-vue';
    import type { PropType } from 'vue';

    const model = defineModel<boolean>({
        required: true
    });

    const props = defineProps({
        title: {
            type: String,
            required: true
        },
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
        primaryActionDisabled: {
            type: Boolean,
            default: false
        },
        primaryActionLoading: {
            type: Boolean,
            default: false
        },
        primaryActionDestructive: {
            type: Boolean,
            default: false,
        },
        fullscreen: {
            type: Boolean,
            default: false,
        },
        fixed: {
            type: Boolean,
            default: false,
        }
    })

    defineEmits(['close'])
</script>

<template>
    <Modal :size="fullscreen ? 'large' : undefined" :open="model" @close="model = false; $emit('close')"
        :primary-action="primaryActionName ? {
            content: primaryActionName,
            onAction: primaryAction,
            disabled: primaryActionDisabled,
            loading: primaryActionLoading,
            destructive: primaryActionDestructive
        } : undefined" :secondary-actions="secondaryActionName ? [
        {
            content: secondaryActionName,
            onAction: secondaryAction
        }
    ] : undefined" :click-outside-to-close="!fixed">
        <template #title>
            {{ title }}
        </template>
        <Box padding="400">
            <slot />
        </Box>
        <template #footer>
            <slot name="footer" />
        </template>
    </Modal>
</template>