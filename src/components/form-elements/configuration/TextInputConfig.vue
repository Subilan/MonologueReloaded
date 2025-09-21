<script setup lang="ts">
import Config from './Config.vue';
import FullButton from '@/components/ui/FullButton.vue';
import Dlg from '@/components/ui/Dlg.vue';
import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import TextfieldConfig from './TextfieldConfig.vue';
import { BlockStack } from '@ownego/polaris-vue';
import { v4 } from 'uuid';
import type { FormElement } from '@/models/form/Form';

const textInputConfig = defineModel<FormElement<'text_input'>>({ required: true });

const modalTextfields = ref(false);

function addTextfield() {
    textInputConfig.value.config.fields.push({
        multiline: 1,
        placeholder: '请输入文本',
        id: v4()
    })
}

function handleRemoveTextfield(id: string) {
    textInputConfig.value = {
        ...textInputConfig.value,
        config: {
            ...textInputConfig.value.config,
            fields: textInputConfig.value.config.fields.filter(x => x.id !== id)
        }
    }
}
</script>

<template>
    <Config v-model="textInputConfig">
        <FullButton @click="modalTextfields = true">编辑输入框</FullButton>
    </Config>

    <Dlg title="编辑输入框" v-model="modalTextfields">
        <BlockStack gap="400">
            <VueDraggable v-if="textInputConfig.config.fields.length" v-model="textInputConfig.config.fields"
                :animation="150" ghost-class="phantom" handle=".drag-handle" class="vertical-list">
                <TextfieldConfig @remove="handleRemoveTextfield" :key="textInputConfig.config.fields[i].id"
                    v-for="textfield, i in textInputConfig.config.fields" v-model="textInputConfig.config.fields[i]" />
            </VueDraggable>
            <em v-else>暂无输入框，请先添加</em>
            <FullButton @click="addTextfield">
                添加输入框
            </FullButton>
        </BlockStack>
    </Dlg>
</template>
