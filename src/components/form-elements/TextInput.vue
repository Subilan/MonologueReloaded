<script setup lang="ts">
    import type { PartialExcept, TextInputCheck, TextInputConfig, TextInputResult } from '@/models/form/TextInput';
    import { ref, type PropType } from 'vue';
    import FormElement from '../FormElement.vue';
    import ConfiguredTextField from '../ConfiguredTextField.vue';

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
        check: {
            type: Object as PropType<TextInputCheck[]>
        },
        config: {
            type: Object as PropType<PartialExcept<TextInputConfig, 'autoComplete'>>,
            default: {
                autoComplete: 'off'
            }
        }
    })

    const value = ref('');
    const returnedError = ref('');

    function get(): TextInputResult {
        return {
            value: value.value,
            valid: returnedError.value === ''
        }
    }

    defineExpose({
        get
    })
</script>

<template>
    <FormElement :title="title" :index="index" :description="description">
        <ConfiguredTextField v-model="value" v-model:error="returnedError" :check="check" :config="config" />
    </FormElement>
</template>