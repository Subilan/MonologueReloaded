<script setup lang="ts">
    import { RangeSlider } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import { ref } from 'vue';

    const props = defineProps({
        label: {
            type: String
        },
        output: {
            type: Boolean
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        step: {
            type: Number,
            default: 1,
        },
        prefix: {
            type: String
        },
        suffix: {
            type: String
        },
        range: {
            type: Boolean,
            default: false
        }
    });

    const value = ref(props.range ? [0, 0] as [number, number] : 0);

    function get(): number | number[] {
        return value.value;
    }

    defineExpose({
        get
    });
</script>

<template>
    <FormElement>
        <RangeSlider :label="label" v-model="value" :output="output" :min="min" :max="max" :step="step" :prefix="prefix" :suffix="suffix" />
    </FormElement>
</template>