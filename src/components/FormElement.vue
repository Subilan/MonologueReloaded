<script setup lang="ts">
    import { Box, Card, InlineStack } from '@ownego/polaris-vue';
    import Draggable from './Draggable.vue';

    const props = defineProps({
        title: {
            type: String
        },
        index: {
            type: Number
        },
        description: {
            type: String
        },
        identifier: {
            type: String,
            default: ''
        },
        classNames: {
            type: String,
            default: ''
        }
    });

</script>

<template>
    <div class="wrapper" :class="classNames">
        <Draggable :identifier="identifier">
            <Card ref="card">
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
        </Draggable>
    </div>
    <hr class="form-element-hr"/>
</template>