<script setup lang="ts">
    import { Box } from '@ownego/polaris-vue';

    const props = defineProps({
        noPaddingBlockEnd: {
            type: Boolean,
            default: false
        }
    })
</script>

<template>
    <Box :padding-block-end="noPaddingBlockEnd ? '0' : '200'">
        <Text variant="headingMd" as="h2">
            <slot />
        </Text>
    </Box>
</template>