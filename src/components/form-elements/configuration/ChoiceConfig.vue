<template>
    <Config v-model="choiceConfig">
        <InlineStack gap="400">
            <Checkbox label="多选题" v-model="choiceConfig.config.isMultiple" />
            <Checkbox label="包含“其它”项" v-model="choiceConfig.config.hasOther" />
        </InlineStack>
        <FullButton @click="modalOptionConfig = true">编辑选项</FullButton>
    </Config>

    <Dlg v-model="modalOptionConfig" title="编辑选项">
        <BlockStack gap="400">
            <vue-draggable v-if="choiceConfig.config.choices.length" :animation="150" handle=".drag-handle"
                ghost-class="phantom" class="vertical-list" v-model="choiceConfig.config.choices">
                <ChoiceOptionConfig @remove="handleRemove" v-for="option, i in choiceConfig.config.choices"
                    v-model="choiceConfig.config.choices[i]" :key="option.id" />
            </vue-draggable>
            <em v-else>暂无选项，请先添加</em>
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
    import FullButton from '@/components/ui/FullButton.vue';

    const modalOptionConfig = ref(false);

    const choiceConfig = defineModel<FormElement<'choice'>>({ required: true });

    function addOption() {
        choiceConfig.value.config.choices.push({
            label: '',
            value: '',
            id: v4()
        })
    }

    function handleRemove(id: string) {
        choiceConfig.value = {
            ...choiceConfig.value, config: {
                ...choiceConfig.value.config,
                choices: choiceConfig.value.config.choices.filter(x => x.id !== id)
            }
        }
    }
</script>