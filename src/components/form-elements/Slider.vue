<script setup lang="ts">
    import { RangeSlider } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import { ref, type PropType } from 'vue';
    import type { FormElements } from '@/models/form/Form';

    const props = defineProps({
        config: {
            type: Object as PropType<FormElements.SliderObject>,
            required: true
        }
    });

    const value = ref(props.config.isRange ? [0, 0] as [number, number] : 0);

    function get(): FormElements.SimpleResult<number | number[]> {
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
        <RangeSlider :label="config.label" v-model="value" :output="config.output" :min="config.minValue"
            :max="config.maxValue" :step="config.step" :prefix="config.prefix" :suffix="config.suffix" />
    </FormElement>
</template>