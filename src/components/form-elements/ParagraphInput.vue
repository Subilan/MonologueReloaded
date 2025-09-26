<script setup lang="ts">
import { TextField, Select, Box, BlockStack } from '@ownego/polaris-vue';
import { computed, ref, type PropType } from 'vue';
import type { ParagraphInputResult } from '@/models/form/elements/ParagraphInput';
import { lintTemplate } from '@/func/form/ParagraphInputLinter';
import type { FormEl } from '@/models/form/Form';
import FormElement from './FormElement.vue';

const props = defineProps({
    self: {
        type: Object as PropType<FormEl<'paragraph_input'>>,
        required: true
    }
});

const templateSplitted = props.self.config.template.split(/\[.*?\]/);
const templateLintResult = computed(() => lintTemplate(props.self.config.template))
const templateConfigurations = computed(() => templateLintResult.value.configurations);

// console.log(templateConfigurations.value)

const fieldCount = templateSplitted.length - 1;

const models = ref(new Array(fieldCount).fill(''));
const errors = ref(new Array(fieldCount).fill(false));
const resContent = computed(() => {
    let res = '';
    for (let i = 0; i < templateSplitted.length - 1; i++) {
        res += templateSplitted[i];
        res += models.value[i] || '';
    }
    res += templateSplitted[templateSplitted.length - 1];
    return res;
})

function get(): ParagraphInputResult {
    return {
        content: resContent.value,
        values: models.value,
        valid: new Array(fieldCount).fill(0).map((_, i) => doCheck(null, i)).every(x => x)
    };
}

defineExpose({
    get
})

function doCheck(e: any, i: number) {
    if (!templateConfigurations.value) return false;

    const value = models.value[i];

    if (Object.keys(templateConfigurations.value[i]).length === 0) return true;

    if (templateConfigurations.value[i].required && value.trim().length === 0) {
        errors.value[i] = true;
        return false;
    }

    if (templateConfigurations.value[i].type === 'number') {
        const number = Number(value);

        if (
            isNaN(number)
            || (templateConfigurations.value[i].min !== '' && number < Number(templateConfigurations.value[i].min))
            || (templateConfigurations.value[i].max !== '' && number > Number(templateConfigurations.value[i].max))
        ) {
            errors.value[i] = true;
            return false;
        }
    }

    if (templateConfigurations.value[i].type === 'text') {
        if (
            (templateConfigurations.value[i].minLength && value.length < Number(templateConfigurations.value[i].minLength))
            || (templateConfigurations.value[i].maxLength && value.length > Number(templateConfigurations.value[i].maxLength))
        ) {
            errors.value[i] = true;
            return false;
        }
    }

    errors.value[i] = false;
    return true;
}

</script>

<template>
    <FormElement>
        <div class="paragraph-container" v-if="templateConfigurations">
            <template v-for="(segment, i) in templateSplitted">
                <Text variant="bodyLg">{{ segment }}</Text>
                <TextField @input="e => doCheck(e, i)" @change="e => doCheck(e, i)" v-model="models[i]"
                    :max-length="Number(templateConfigurations[i]['maxLength']) || undefined" :error="errors[i]"
                    :min-length="Number(templateConfigurations[i]['minLength']) || undefined"
                    :min="templateConfigurations[i]['min']" :max="templateConfigurations[i]['max']"
                    :type="templateConfigurations[i]['type']" size="slim" auto-size class="paragraph-textfield"
                    auto-complete="off"
                    v-if="i < templateSplitted.length - 1 && templateConfigurations[i]['type'] !== 'select'" />
                <Select v-model="models[i]" :options="templateConfigurations[i]['options']?.map(x => {
                    return {
                        label: x,
                        value: x
                    }
                })" v-if="i < templateSplitted.length - 1 && templateConfigurations[i]['type'] === 'select'" />
            </template>
        </div>
        <div class="error-container" v-else-if="templateLintResult.errors.length > 0">
            <BlockStack gap="200">
                <p><strong>Cannot parse template:</strong> {{ templateLintResult.errors[0].message }}, at token {{
                    templateLintResult.errors[0].start }}-{{ templateLintResult.errors[0].end }}, {{
                        templateLintResult.errors[0].suggestion }}.</p>
                <Box padding="200" border-radius="200" border-color="border" border-width="50">
                    <code v-text="self.config.template.substring(0, templateLintResult.errors[0].start)" /><code
                        style="color: red;"
                        v-text="self.config.template.substring(templateLintResult.errors[0].start, templateLintResult.errors[0].end)" /><code
                        v-text="self.config.template.substring(templateLintResult.errors[0].end, self.config.template.length)" />
                </Box>
            </BlockStack>
        </div>
    </FormElement>
</template>

<style lang="scss">
.paragraph-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}


.paragraph-textfield input {
    min-width: 100px;
}
</style>