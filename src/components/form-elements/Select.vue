<script lang="ts" setup>
    import type { SelectOption } from '@/models/form/Select';
    import { computed, ref } from 'vue';
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
        }
    });

    const selected = ref('');

    const options = computed(() => {
        let base: SelectOption[] = [
            { label: 'Today', value: 'today' },
            { label: 'Yesterday', value: 'yesterday' },
            { label: 'Last 7 days', value: 'lastWeek' },
        ];

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
        <Select :options="options" v-model="selected" :help-text="helperText"/>
    </FormElement>
</template>