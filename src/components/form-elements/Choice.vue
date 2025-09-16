<script lang="ts" setup>
    import { ChoiceList } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import { computed, h, ref, resolveComponent, type PropType } from 'vue';
    import type { ChoiceResult } from '@/models/form/elements/Choice';
    import type { FormEl } from '@/models/form/Form';

    const props = defineProps({
        self: {
            type: Object as PropType<FormEl<'choice'>>,
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
    });

    const finalChoices = computed(() => {
        // let base: ChoiceOption[] = [
        //     { label: 'Hidden', value: 'hidden', helpText: 'example help text' },
        //     { label: 'Optional', value: 'optional' },
        //     { label: 'Required', value: 'required' }
        // ];

        let base = [...props.self.config.choices];

        if (props.self.config.hasOther) {
            base.push({
                label: props.self.config.otherLabel || 'Other',
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
        <ChoiceList :choices="finalChoices" v-model="selected" :allow-multiple="self.config.isMultiple" />
    </FormElement>
</template>