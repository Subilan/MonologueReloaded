<template>
    <Box padding="400" border-width="50" border-color="border" border-radius="200">
        <Box padding-block-end="200">
            <InlineStack gap="200">
                ID: {{ fieldConfig.id.slice(0, 8) }}
                <div class="spacer" />
                <Button tone="critical" @click="$emit('remove', fieldConfig.id)">删除</Button>
                <DragHandle />
            </InlineStack>
        </Box>
        <VerticalLayout>
            <Select label="输入类型" :options="TextfieldTypes.concat(PleaseSelectOption)"
                v-model="fieldConfig.type"></Select>
            <InlineGrid gap="400" columns="3fr 1fr">
                <TextField auto-complete="off" label="占位符" help-text="未输入状态下的默认文字" v-model="fieldConfig.placeholder">
                </TextField>
                <NumberTextField label="高度" suffix="行" v-model="fieldConfig.multiline" :min="1" :max="10" />
            </InlineGrid>
            <InlineGrid gap="400" columns="1fr 1fr">
                <TextField v-model="fieldConfig.label" auto-complete="off" label="标签" help-text="显示于输入框上方的文本" />
                <TextField v-model="fieldConfig.helperText" auto-complete="off" label="提示文本" help-text="为该输入框提供更多说明信息">
                </TextField>
            </InlineGrid>
            <InlineGrid gap="400" columns="1fr 1fr" v-if="fieldConfig.type === 'number' || fieldConfig.type === 'integer'">
                <NumberTextField :error="numberConfigInvalid" label="最小值" v-model="fieldConfig.min" :step="fieldConfig.type === 'integer' ? 1 : undefined" />
                <NumberTextField :error="numberConfigInvalid" label="最大值" v-model="fieldConfig.max" :step="fieldConfig.type === 'integer' ? 1 : undefined" />
            </InlineGrid>
            <InlineStack gap="400">
                <Checkbox v-model="fieldConfig.required" label="必填" />
                <Checkbox v-model="fieldConfig.showCharacterCount" label="显示字数统计" v-if="!disableShowCharacterCount" />
                <Checkbox v-if="fieldConfig.type === 'text'" v-model="showLengthConfig" label="限制字数" />
            </InlineStack>
            <Box v-if="fieldConfig.type === 'text' && showLengthConfig">
                <CardTitle sub="设置该输入框的最小/最大输入长度，0 表示不限制。">字数限制</CardTitle>
                <InlineGrid columns="1fr 1fr" gap="400">
                    <NumberTextField :error="lengthConfigInvalid" label="最小长度" v-model="fieldConfig.minLength" :min="1"
                        :step="1" suffix="字符" />
                    <NumberTextField :error="lengthConfigInvalid" label="最大长度" v-model="fieldConfig.maxLength" :min="1"
                        :step="1" suffix="字符" />
                </InlineGrid>
            </Box>
            <Box v-if="fieldConfig.type === 'text'">
                <CardTitle>正则表达式</CardTitle>
                <div class="vertical-list">
                    <em v-if="!fieldConfig.regex || fieldConfig.regex.length === 0">
                        暂无正则表达式
                    </em>
                    <VueDraggable v-else v-model="fieldConfig.regex" :animation="150" handle=".drag-handle"
                        ghost-class="phantom" class="vertical-list no-border-bottom">
                        <RegexConfig @remove="handleRemove" :key="regexConfig.id"
                            v-for="regexConfig, i in fieldConfig.regex" v-model="fieldConfig.regex[i]" />
                    </VueDraggable>
                    <FullButton variant="secondary" @click="addRegex">添加正则表达式</FullButton>
                </div>
            </Box>
        </VerticalLayout>
    </Box>
</template>

<script lang="ts" setup>
import DragHandle from '@/components/ui/DragHandle.vue';
import NumberTextField from '@/components/ui/NumberTextField.vue';
import type { WithId } from '@/models/base/basic';
import type { TextInputField } from '@/models/form/elements/TextInput';
import { PleaseSelectOption } from '@/static/Common';
import { TextfieldTypes } from '@/static/TextfieldTypes';
import { Box, Button, Checkbox, InlineGrid, InlineStack, Select, TextField } from '@ownego/polaris-vue';
import { computed, ref, watch } from 'vue';
import VerticalLayout from '@/components/ui/VerticalLayout.vue';
import CardTitle from '@/components/CardTitle.vue';
import { VueDraggable } from 'vue-draggable-plus';
import RegexConfig from './RegexConfig.vue';
import FullButton from '@/components/ui/FullButton.vue';
import { v4 } from 'uuid';

const fieldConfig = defineModel<WithId<Partial<TextInputField>>>({ required: true });

const showLengthConfig = ref(false);

const lengthConfigInvalid = computed(() => {
    if (fieldConfig.value.maxLength && fieldConfig.value.minLength) {
        return fieldConfig.value.maxLength < fieldConfig.value.minLength;
    }

    return false;
});

const numberConfigInvalid = computed(() => {
    if (fieldConfig.value.max && fieldConfig.value.min) {
        return fieldConfig.value.max <= fieldConfig.value.min;
    }

    return false;
});

defineEmits(['remove'])

function addRegex() {
    if (!fieldConfig.value.regex) {
        fieldConfig.value.regex = [];
    }

    fieldConfig.value.regex.push({
        r: '',
        error: '',
        id: v4()
    })
}

function handleRemove(id: string) {
    fieldConfig.value = {
        ...fieldConfig.value,
        regex: fieldConfig.value.regex?.filter(x => x.id !== id)
    }
}

const disableShowCharacterCount = ref(false);

watch(() => fieldConfig.value.type, v => {
    if (v === '' || v === undefined) return;
    
    if (['integer', 'number', 'time'].includes(v)) {
        fieldConfig.value.showCharacterCount = false;
        disableShowCharacterCount.value = true;
    } else {
        disableShowCharacterCount.value = false;
    }
})
</script>