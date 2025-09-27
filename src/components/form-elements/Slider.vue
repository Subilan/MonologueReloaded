<script setup lang="ts">
import { RangeSlider } from '@ownego/polaris-vue';
import FormElement from './FormElement.vue';
import { computed, ref, watch, type PropType } from 'vue';
import type { FormEl, SimpleResult } from '@/models/form/Form';

const props = defineProps({
    self: {
        type: Object as PropType<FormEl<'slider'>>,
        required: true
    }
});

const minValue = computed(() => props.self.config.minValue || 0)

const singleValue = ref(0);
const rangeValue = ref<[number, number]>([minValue.value, minValue.value]);

function get(): SimpleResult<number | number[]> {
    return {
        valid: true,
        value: props.self.config.isRange ? rangeValue.value : singleValue.value
    };
}

defineExpose({
    get
});
</script>

<template>
    <FormElement>
        <RangeSlider v-if="self.config.isRange" :label="self.config.label" v-model="rangeValue"
            :min="self.config.minValue" :max="self.config.maxValue" :step="self.config.step"
            :prefix="self.config.prefix" :suffix="self.config.suffix" :output="self.config.output" />
        <RangeSlider v-else :label="self.config.label" v-model="singleValue" :min="self.config.minValue"
            :max="self.config.maxValue" :step="self.config.step" :prefix="self.config.prefix"
            :suffix="self.config.suffix" :output="self.config.output" />
    </FormElement>
</template>