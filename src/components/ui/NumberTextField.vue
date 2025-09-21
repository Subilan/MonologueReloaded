<script setup lang="ts">
    import { TextField } from '@ownego/polaris-vue';
    import { ref, watch } from 'vue';

    const model = defineModel<number>({ default: 0 });

    const props = defineProps({
        min: {
            type: Number
        },
        max: {
            type: Number
        },
        step: {
            type: Number
        },
        label: {
            type: String
        },
        helpText: {
            type: String
        },
        suffix: {
            type: String
        },
        error: {
            type: Boolean,
            default: false,
        }
    })

    const val = ref(model.value.toString());
    watch(val, v => model.value = Number(v));
</script>

<template>
    <TextField :error="error" :label="label" :suffix="suffix" :help-text="helpText" auto-complete="off" v-model="val" :min="min" :max="max" :step="step" type="number"/>
</template>
