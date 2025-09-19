<template>
    <Config v-model="choiceConfig">
        <InlineStack gap="400">
            <Checkbox label="多选题" v-model="choiceConfig.config.isMultiple" />
            <Checkbox label="包含“其它”项" v-model="choiceConfig.config.hasOther" />
        </InlineStack>

        <Button style="width: 100%;" variant="primary" @click="modalOptionConfig = true">编辑选项</Button>
    </Config>

    <Dlg v-model="modalOptionConfig" title="编辑选项">
        <BlockStack gap="400">
            <vue-draggable :animation="150" handle=".drag-handle" ghost-class="phantom" class="option-configs"
                v-model="choiceConfig.config.choices">
                <ChoiceOptionConfig v-for="option, i in choiceConfig.config.choices"
                    v-model="choiceConfig.config.choices[i]" :key="option.id" />
            </vue-draggable>
            <Button style="width: 100%;" variant="primary" @click="addOption">添加选项</Button>
        </BlockStack>
    </Dlg>
</template>

<script lang="ts" setup>
    import type { FormElement } from '@/models/form/Form';
    import Config from './Config.vue';
    import { BlockStack, Checkbox, InlineStack } from '@ownego/polaris-vue';
    import Dlg from '@/components/ui/Dlg.vue';
    import { ref } from 'vue';
    import ChoiceOptionConfig from './ChoiceOptionConfig.vue';
    import { VueDraggable } from 'vue-draggable-plus';
    import { v4 } from 'uuid';

    const modalOptionConfig = ref(false);

    const choiceConfig = defineModel<FormElement<'choice'>>({ required: true });

    function addOption() {
        choiceConfig.value.config.choices.push({
            label: '',
            value: '',
            id: v4()
        })
    }
</script>

<style lang="scss" scoped>
.option-configs {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>