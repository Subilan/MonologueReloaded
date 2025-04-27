<script setup lang="ts">
    import { Box, Card, InlineStack } from '@ownego/polaris-vue';

    const props = defineProps({
        title: {
            type: String
        },
        index: {
            type: Number
        },
        description: {
            type: String
        }
    });
</script>

<template>
    <Card>
        <Box padding-block-end="400">
            <InlineStack gap="400">
                <Text variant="headingLg" as="h2">
                    {{ index }}
                </Text>
                <Text variant="headingLg" as="h2">
                    {{ title }}
                </Text>
            </InlineStack>
        </Box>
        <Box padding-block-end="200" v-if="description">
            <Text variant="bodyMd" as="p" v-html="description">
            </Text>
        </Box>
        <slot />
    </Card>
</template>