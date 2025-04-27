<script lang="ts" setup>
    import type { SelectOption } from '@/models/form/Select';
    import { computed, ref, type PropType } from 'vue';
    import { Select } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';

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
        helperText: {
            type: String
        },
        options: {
            type: Object as PropType<SelectOption[]>
        }
    });

    const selected = ref('');

    const finalOptions = computed(() => {
        let base = props.options;

        return base;
    });

    function get() {
        return selected.value;
    }

    defineExpose({
        get
    })
</script>

<template>
    <FormElement :title="title" :index="index" :description="description">
        <Select :options="finalOptions" v-model="selected" :help-text="helperText"/>
    </FormElement>
</template>