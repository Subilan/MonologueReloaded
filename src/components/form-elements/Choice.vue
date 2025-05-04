<script lang="ts" setup>
    import { ChoiceList } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import { computed, h, ref, resolveComponent, type PropType } from 'vue';
    import type { ChoiceOption, ChoiceResult } from '@/models/form/elements/Choice';
    import type { FormElements } from '@/models/form/Form';

    const props = defineProps({
        config: {
            type: Object as PropType<FormElements.ChoiceObject>,
            required: true
        }
    });

    const selected = ref<string[]>([]);
    const otherValue = ref('');

    const otherChoice = h(resolveComponent('TextField'), {
        labelHidden: true,
        modelValue: otherValue.value,
        autoComplete: 'off',
        'onUpdate:modelValue': (value: string) => {
            otherValue.value = value;
        }
    })

    const finalChoices = computed(() => {
        // let base: ChoiceOption[] = [
        //     { label: 'Hidden', value: 'hidden', helpText: 'example help text' },
        //     { label: 'Optional', value: 'optional' },
        //     { label: 'Required', value: 'required' }
        // ];

        let base = structuredClone(props.config.choices);

        if (props.config.hasOther) {
            base.push({
                label: props.config.otherLabel || 'Other',
                value: 'other',
                renderChildren: selected.value.includes('other') && otherChoice
            })
        }

        return base;
    });

    function get(): ChoiceResult {
        return {
            selection: selected.value,
            otherValue: otherValue.value,
            valid: selected.value.length > 0
        };
    }

    defineExpose({
        get
    });
</script>

<template>
    <FormElement>
        <ChoiceList :choices="finalChoices" v-model="selected" :allow-multiple="config.isMultiple" />
    </FormElement>
</template>