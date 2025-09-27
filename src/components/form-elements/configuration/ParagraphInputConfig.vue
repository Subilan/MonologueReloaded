<template>
    <Config v-model="paragraphInputConfig">
        <Box>
            <CardTitle label>
                段落模板
                <template #right>
                    <Tooltip content="将进行语法检查">
                        <Button variant="secondary" size="micro" @click="applyTemplateText">应用</Button>
                    </Tooltip>
                </template>
            </CardTitle>
            <TextField auto-complete="off" v-model="templateText" placeholder="在此键入段落填空的模板" :multiline="6"
                :error="templateError" />
        </Box>
    </Config>
</template>

<script lang="ts" setup>
import type { FormElement } from '@/models/form/Form';
import Config from './Config.vue';
import { Box, TextField, Tooltip } from '@ownego/polaris-vue';
import CardTitle from '@/components/CardTitle.vue';
import { Button } from '@ownego/polaris-vue';
import { ref } from 'vue';
import { lintTemplate } from '@/func/form/ParagraphInputLinter';

const paragraphInputConfig = defineModel<FormElement<'paragraph_input'>>({ required: true });
const templateText = ref(paragraphInputConfig.value.config.template);

const templateError = ref('')

function applyTemplateText() {
    const lintResult = lintTemplate(templateText.value)
    if (!lintResult.valid) {
        templateError.value = lintResult.errors[0].message;
        return;
    }
    templateError.value = '';
    paragraphInputConfig.value.config.template = templateText.value;
}
</script>