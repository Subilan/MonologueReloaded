<script setup lang="ts">
    import type { TextInputCheck } from '@/models/form/TextInput';
    import { TextField } from '@ownego/polaris-vue';
    import { ref, watch, type PropType } from 'vue';
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
        type: {
            type: Object as PropType<"number" | "text" | "search" | "url" | "email" | "tel" | "time" | "integer" | "password" | "date" | "datetime-local" | "month" | "week" | "currency" | undefined>,
            default: 'text'
        },
        max: {
            type: Number
        },
        min: {
            type: Number
        },
        maxLength: {
            type: Number
        },
        placeholder: {
            type: String
        },
        label: {
            type: String
        },
        autoComplete: {
            type: Object as PropType<'on' | 'off'>,
            default: 'off'
        },
        checks: {
            type: Object as PropType<TextInputCheck[]>
        },
        lines: {
            type: Number,
            default: 0
        },
        helperText: {
            type: String
        },
        count: {
            type: Boolean,
            default: false
        }
    })

    const value = ref('');
    const error = ref('');

    watch(value, v => {
        if (props.checks) {
            // 要求所有正则都满足
            if (props.checks.every(check => check.r.test(value.value))) {
                error.value = '';
            } else {
                // 总是返回第一个不满足的正则的错误
                for (let check of props.checks) {
                    if (!check.r.test(v)) {
                        error.value = check.error;
                        break;
                    }
                }
            }
        }
    });

    function get() {
        return value.value;
    }

    defineExpose({
        get
    })
</script>

<template>
    <FormElement :title="title" :index="index" :description="description">
        <TextField :label="label" :multiline="lines" :auto-complete="autoComplete" v-model="value" :type="type"
            :max="max" :help-text="helperText" :min="min" :max-length="maxLength" :placeholder="placeholder"
            :error="error" :show-character-count="count" />
    </FormElement>
</template>