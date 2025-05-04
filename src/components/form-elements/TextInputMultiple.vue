<script setup lang="ts">
    import { ref, type PropType } from 'vue';
    import FormElement from '../FormElement.vue';
    import type { PartialExcept, TextInputCheck, TextInputConfig, TextInputResult } from '@/models/form/TextInput';
    import ConfiguredTextField from '../ConfiguredTextField.vue';
    import { BlockStack } from '@ownego/polaris-vue';

    const props = defineProps({
        title: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        checks: {
            type: Object as PropType<TextInputCheck[][]>,
            default: []
        },
        configs: {
            type: Object as PropType<PartialExcept<TextInputConfig, 'autoComplete'>[]>,
            default: []
        }
    })

    const textfields = props.configs.length;
    const models = ref(new Array(textfields).fill(''));
    const returnedErrors = ref(new Array(textfields).fill(''));

    function get(): TextInputResult[] {
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
    <FormElement :title="title" :index="index" :description="description">
        <BlockStack align="center" gap="200">
            <ConfiguredTextField v-for="(cfg, i) in configs" :config="cfg" v-model:error="returnedErrors[i]"
                v-model="models[i]" :check="checks[i]" />
        </BlockStack>
    </FormElement>
</template>