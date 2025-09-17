<script setup lang="ts">
    import { ref, type PropType } from 'vue';
    import FormElement from './FormElement.vue';
    import ConfiguredTextField from '../ConfiguredTextField.vue';
    import { BlockStack } from '@ownego/polaris-vue';
    import type { FormEl, SimpleResult } from '@/models/form/Form';

    const props = defineProps({
        self: {
            type: Object as PropType<FormEl<'text_input'>>,
            required: true
        }
    })

    const textfields = props.self.config.fields.length;
    const models = ref(new Array(textfields).fill(''));
    const returnedErrors = ref(new Array(textfields).fill(''));

    function get(): SimpleResult<string>[] {
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
            <ConfiguredTextField v-for="(cfg, i) in self.config.fields" :config="cfg" v-model:error="returnedErrors[i]"
                v-model="models[i]" :check="self.config.checks[i]" />
        </BlockStack>
    </FormElement>
</template>