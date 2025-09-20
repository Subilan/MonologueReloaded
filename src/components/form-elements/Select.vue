<script lang="ts" setup>
    import { computed, ref, type PropType } from 'vue';
    import { Select } from '@ownego/polaris-vue';
    import FormElement from './FormElement.vue';
    import type { FormEl, SimpleResult } from '@/models/form/Form';
    import { PleaseSelectOption } from '@/static/Common';

    const props = defineProps({
        self: {
            type: Object as PropType<FormEl<'select'>>,
            required: true
        }
    });

    const selected = ref('');
    const allowEmpty = props.self.config.options.some(x => x.label === '');

    const finalOptions = computed(() => {
        let base = props.self.config.options.map(x => {
            return {
                label: x.label,
                value: x.label
            }
        });

        if (props.self.required) base.push(PleaseSelectOption)

        return base;
    });

    function get(): SimpleResult<string> {
        return {
            valid: allowEmpty || selected.value.trim().length > 0,
            value: selected.value
        };
    }

    defineExpose({
        get
    })
</script>

<template>
    <FormElement>
        <Select :options="finalOptions" v-model="selected" :help-text="self.config.helperText" />
    </FormElement>
</template>