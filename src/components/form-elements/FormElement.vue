<script setup lang="ts">
import { Badge, BlockStack, Box, Card, Icon, InlineStack, Text } from '@ownego/polaris-vue';
import DragHandle from '../ui/DragHandle.vue';
import useBuilderFormSettings from '@/composables/useBuilderFormSettings';
import DisplayNumber from '../DisplayNumber.vue';

const props = defineProps({
    title: {
        type: String
    },
    index: {
        type: Number,
    },
    description: {
        type: String
    },
    required: {
        type: Boolean,
    },
    classNames: {
        type: String,
        default: ''
    }
});

const builderFormSettings = useBuilderFormSettings();
</script>

<template>
    <div class="wrapper" :class="classNames">
        <BlockStack gap="400">
            <div class="add-component-placeholder top">
                在此处新增控件
            </div>
            <Card ref="card">
                <Box padding-block-end="400">
                    <InlineStack :gap="builderFormSettings.indexFormat === 'hanzi' && builderFormSettings.indexFormatConfig['dotsign'] ? 0 : 400" block-align="center"
                        :class="builderFormSettings.boldTitle ? {} : { 'no-bold': true }">
                        <Text variant="headingLg" as="h2" v-if="index">
                            <DisplayNumber :value="index"
                                :config="{ format: builderFormSettings.indexFormat, configuration: builderFormSettings.indexFormatConfig }" />
                        </Text>
                        <InlineStack gap="200" block-align="center">
                            <Text variant="headingLg" as="h2">
                                {{ title }}
                            </Text>
                            <template v-if="required">
                                <template v-if="builderFormSettings.requiredIndicatorStyle === 'asterisk'">
                                    <Text variant="headingLg" as="h2">
                                        <span style="color: red;">*</span>
                                    </Text>
                                </template>
                                <template v-else>
                                    <Badge>必填</Badge>
                                </template>
                            </template>
                        </InlineStack>
                        <div class="spacer" />
                        <DragHandle />
                    </InlineStack>
                </Box>
                <Box padding-block-end="200" v-if="description">
                    <Text variant="bodyMd" as="p" v-html="description">
                    </Text>
                </Box>
                <slot />
            </Card>
            <div class="add-component-placeholder bottom">
                在此处新增控件
            </div>
        </BlockStack>
    </div>
</template>

<style lang="scss" scoped>
.add-component-placeholder {
    text-align: center;
    padding: 4px;
    border-radius: var(--p-border-radius-200);
    border: 1px dashed var(--p-color-text-disabled);
    color: var(--p-color-text-secondary);
    display: none;
}

.wrapper {
    &.component-at-top {
        .top {
            display: block;
        }
    }

    &.component-at-bottom {
        .bottom {
            display: block;
        }
    }

    .Polaris-ShadowBevel {
        transition: all .2s ease;
    }

    &.selected {
        .Polaris-ShadowBevel {
            box-shadow: 0 0 0 4px rgba($color: black, $alpha: .2)
        }
    }
}

.no-bold {
    * {
        font-weight: normal !important;
    }
}
</style>