<script setup lang="ts">
import { Box, InlineStack } from '@ownego/polaris-vue';

const props = defineProps({
    noPaddingBlockEnd: {
        type: Boolean,
        default: false
    },
    sub: {
        type: String
    }
})
</script>

<template>
    <Box :padding-block-end="noPaddingBlockEnd ? '0' : '200'">
        <InlineStack block-align="center" gap="200">
            <Text variant="headingMd" as="h2">
                <slot />
            </Text>
            <Text v-if="sub" variant="bodySm" as="p" tone="subdued">
                {{ sub }}
            </Text>
        </InlineStack>
    </Box>
</template>