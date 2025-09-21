<script lang="ts" setup>
import type { TextInputCheck, TextInputField } from '@/models/form/elements/TextInput';
import { TextfieldRegexPreset, TextfieldRegexPresetFailMessage } from '@/static/TextfieldRegexPreset';
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

watch(() => props.config.type, _ => {
    doCheck(model.value);
})

const error = ref('');

function doCheck(value: string) {
    if (props.config.type === undefined || props.config.type === '' || props.config.type === 'password') return;

    if (props.config.type === 'text') {
        if (value.trim().length === 0) {
            if (props.config.required) error.value = '此项必填';
            else error.value = '';

            return;
        }

        if (props.check) {
            // 总是返回第一个不满足的正则的错误
            for (let check of props.check) {
                try {
                    if (!RegExp(check.r).test(value)) {
                        error.value = check.error;
                        return;
                    }
                } catch (e) {
                    // 跳过无效正则表达式
                    continue;
                }
            }

            error.value = '';
        }
    } else {
        if (!TextfieldRegexPreset[props.config.type].test(value)) {
            error.value = TextfieldRegexPresetFailMessage[props.config.type];
        } else {
            error.value = '';
        }
    }
}

function onInput(e: InputEvent) {
    if (!e.target) return;

    doCheck((e.target as HTMLInputElement).value);
}

function onChange(v: string) {
    doCheck(v);
}

const model = defineModel<string>({ required: true });
const errorModel = defineModel('error');

watch(error, v => {
    errorModel.value = v;
});
</script>

<template>
    <TextField @input="onInput" @change="onChange" :label="config.label" :multiline="config.multiline"
        :auto-complete="config.autoComplete" :type="config.type" :max="config.max"
        :help-text="error === '' ? config.helperText : undefined" :min="config.min" :max-length="config.maxLength"
        :placeholder="config.placeholder" v-model="model" :show-character-count="config.showCharacterCount"
        :error="error" />
</template>