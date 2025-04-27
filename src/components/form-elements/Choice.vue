<script lang="ts" setup>
    import { ChoiceList } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import { computed, h, ref, resolveComponent } from 'vue';
    import type { ChoiceOption, ChoiceResult } from '@/models/form/Choice';

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
        multiple: {
            type: Boolean,
            default: false,
        },
        other: {
            type: Boolean,
            default: false
        },
        otherLabel: {
            type: String,
            default: 'Other'
        },
    });

    const selected = ref(['']);
    const otherValue = ref('');

    const otherChoice = h(resolveComponent('TextField'), {
        labelHidden: true,
        modelValue: otherValue.value,
        autoComplete: 'off',
        'onUpdate:modelValue': (value: string) => {
            otherValue.value = value;
        }
    })

    const testChoices = computed(() => {
        let base: ChoiceOption[] = [
            { label: 'Hidden', value: 'hidden', helpText: 'example help text' },
            { label: 'Optional', value: 'optional' },
            { label: 'Required', value: 'required' }
        ];

        if (props.other) {
            base.push({
                label: props.otherLabel,
                value: 'other',
                renderChildren: selected.value.includes('other') && otherChoice
            })
        }

        return base;
    });

    function get(): ChoiceResult {
        return {
            selection: selected.value,
            otherValue: otherValue.value
        };
    }

    defineExpose({
        get
    });
</script>

<template>
    <FormElement :title="title" :index="index" :description="description">
        <ChoiceList :choices="testChoices" v-model="selected" :allow-multiple="multiple" />
    </FormElement>
</template>