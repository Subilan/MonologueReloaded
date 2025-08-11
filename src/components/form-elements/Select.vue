<script lang="ts" setup>
    import type { SelectOption } from '@/models/form/elements/Select';
    import { computed, ref, type PropType } from 'vue';
    import { Select } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import type { FormEl, SimpleResult } from '@/models/form/Form';

    const props = defineProps({
        self: {
            type: Object as PropType<FormEl<'select'>>,
            required: true
        }
    });

    const selected = ref('');
    const allowEmpty = props.self.config.options.some(x => x.value === '');

    const finalOptions = computed(() => {
        let base = props.self.config.options;

        if (!allowEmpty) base.push({
            label: '请选择',
            value: ''
        })

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