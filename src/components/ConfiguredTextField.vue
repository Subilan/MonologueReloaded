<script lang="ts" setup>
import type { TextInputCheck, TextInputField } from '@/models/form/elements/TextInput';
import { ref, watch, type PropType } from 'vue';

const props = defineProps({
    config: {
        type: Object as PropType<Partial<TextInputField>>,
        default: {
            autoComplete: 'off'
        }
    },
    check: {
        type: Object as PropType<TextInputCheck[]>,
        default: []
    }
})

const error = ref('');

function doCheck(value: string) {
    if (props.check) {
        // 总是返回第一个不满足的正则的错误
        for (let check of props.check) {
            try {
                if (!RegExp(check.r).test(value)) {
                    error.value = check.error;
                    break;
                }
            } catch (e) {
                // 跳过无效正则表达式
                continue;
            }
        }

        error.value = '';
    }
}

function onInput(e: InputEvent) {
    if (!e.target) return;

    doCheck((e.target as HTMLInputElement).value);
}

function onChange(v: string) {
    doCheck(v);
}

const model = defineModel();
const errorModel = defineModel('error');

watch(error, v => errorModel.value = error.value);
</script>

<template>
    <TextField @input="onInput" @change="onChange" :label="config.label" :multiline="config.multiline"
        :auto-complete="config.autoComplete" :type="config.type" :max="config.max" :help-text="config.helperText"
        :min="config.min" :max-length="config.maxLength" :placeholder="config.placeholder" v-model="model"
        :show-character-count="config.showCharacterCount" :error="error" />
</template>