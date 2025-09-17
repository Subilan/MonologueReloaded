<script setup lang="ts">
    import { RangeSlider } from '@ownego/polaris-vue';
    import FormElement from './FormElement.vue';
    import { ref, type PropType } from 'vue';
    import type { FormEl, SimpleResult } from '@/models/form/Form';

    const props = defineProps({
        self: {
            type: Object as PropType<FormEl<'slider'>>,
            required: true
        }
    });

    const value = ref(props.self.config.isRange ? [0, 0] as [number, number] : 0);

    function get(): SimpleResult<number | number[]> {
        return {
            valid: true,
            value: value.value
        };
    }

    defineExpose({
        get
    });
</script>

<template>
    <FormElement>
        <RangeSlider :label="self.config.label" v-model="value" v-bind="self.config" />
    </FormElement>
</template>