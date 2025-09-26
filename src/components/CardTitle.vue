<script setup lang="ts">
import { Box, InlineStack } from '@ownego/polaris-vue';

const props = defineProps({
    noPaddingBlockEnd: {
        type: Boolean,
        default: false
    },
    sub: {
        type: String
    },
    label: {
        type: Boolean,
        default: false,
    }
})
</script>

<template>
    <Box :padding-block-end="noPaddingBlockEnd ? '0' : (label ? '100' : '200')">
        <InlineStack block-align="center" gap="200">
            <Text v-if="label" variant="bodyMd" as="h2">
                <slot />
            </Text>
            <Text v-else variant="headingMd" as="h2">
                <slot />
            </Text>
            <Text v-if="sub" variant="bodySm" as="p" tone="subdued">
                {{ sub }}
            </Text>
            <div class="spacer"></div>
            <slot name="right"/>
        </InlineStack>
    </Box>
</template>