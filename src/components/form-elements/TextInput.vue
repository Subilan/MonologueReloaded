<script setup lang="ts">
    import { ref, type PropType } from 'vue';
    import FormElement from '../FormElement.vue';
    import type { PartialExcept, TextInputCheck, TextInputConfig } from '@/models/form/elements/TextInput';
    import ConfiguredTextField from '../ConfiguredTextField.vue';
    import { BlockStack } from '@ownego/polaris-vue';
    import type { FormElements } from '@/models/form/Form';

    const props = defineProps({
        config: {
            type: Object as PropType<FormElements.TextInputObject>,
            required: true
        }
    })

    const textfields = props.config.configs.length;
    const models = ref(new Array(textfields).fill(''));
    const returnedErrors = ref(new Array(textfields).fill(''));

    function get(): FormElements.SimpleResult<string>[] {
        return new Array(textfields).fill(0).map((_, i) => {
            return {
                value: models.value[i],
                valid: returnedErrors.value[i] === ''
            }
        });
    }

    defineExpose({
        get
    });
</script>

<template>
    <FormElement>
        <BlockStack align="center" gap="200">
            <ConfiguredTextField v-for="(cfg, i) in config.configs" :config="cfg" v-model:error="returnedErrors[i]"
                v-model="models[i]" :check="config.checks[i]" />
        </BlockStack>
    </FormElement>
</template>