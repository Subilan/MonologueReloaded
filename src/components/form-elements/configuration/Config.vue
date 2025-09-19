<script setup lang="ts">
    import type { FormElement } from '@/models/form/Form';
    import { FormLayout, InlineStack, TextField } from '@ownego/polaris-vue';

    const config = defineModel<FormElement>({ required: true });
</script>

<template>
    <FormLayout>
        <TextField auto-complete="off" read-only v-model="config.identifier" label="标识符" />
        <TextField auto-complete="off" v-model="config.title" label="标题" placeholder="输入标题" help-text="该表单元素的主要内容" />
        <TextField auto-complete="off" v-model="config.description" :multiline="5" label="介绍文本" placeholder="输入文本">
            <template #helpText>
                <InlineStack gap="100">
                    <img class="support-markdown-logo" src="/images/language-markdown-outline.svg"/>
                    <span>该表单元素的具体描述信息，显示在标题的下方</span>
                </InlineStack>
            </template>
        </TextField>
        <slot />
    </FormLayout>
</template>

<style lang="scss" scoped>
.support-markdown-logo {
    pointer-events: none;
    height: 20px;
    opacity: .5;
}
</style>