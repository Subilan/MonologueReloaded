<script lang="ts" setup>
    import { BlockStack, Box, Checkbox, InlineStack, RadioButton, TextField } from '@ownego/polaris-vue';
    import FormElement from './FormElement.vue';
    import { reactive, ref, watch, type PropType } from 'vue';
    import type { ChoiceResult } from '@/models/form/elements/Choice';
    import type { FormEl } from '@/models/form/Form';

    const props = defineProps({
        self: {
            type: Object as PropType<FormEl<'choice'>>,
            required: true
        }
    });

    const otherValue = ref('');

    // 多选，适用于 Checkbox
    const isChecked = reactive<Record<string, boolean>>({});

    // 单选，适用于 RadioButton
    const singleChoice = ref('');

    watch(singleChoice, v => {
        clearChecked();
        isChecked[v] = true;
    })

    function get(): ChoiceResult {
        let result: ChoiceResult = {
            selection: Object.keys(isChecked).filter(k => isChecked[k]),
            otherValue: otherValue.value,
            valid: false,
        };

        result.valid = result.selection.length > 0;
        return result;
    }

    /**
     * 重置选择状态
     */
    function clearChecked() {
        // @ts-ignore
        Object.keys(isChecked).forEach(k => isChecked[k] = false);
    }

    watch(() => props.self.config.isMultiple, v => {
        clearChecked();
    })

    defineExpose({
        get
    });
</script>

<template>
    <FormElement>
        <BlockStack>
            <template v-if="self.config.isMultiple">
                <Checkbox :label="x.label" v-for="x in self.config.choices" v-model="isChecked[x.id]">
                    <template #helpText>
                        {{ x.helpText }}
                    </template>
                </Checkbox>
                <Checkbox label="其它" v-model="isChecked['other']" />
            </template>
            <template v-else>
                <RadioButton :name="`radio-for-${self.identifier}`" :label="x.label" :value="x.id"
                    v-for="x in self.config.choices" v-model="singleChoice">
                    <template #helpText>
                        {{ x.helpText }}
                    </template>
                </RadioButton>
                <RadioButton :name="`radio-for-${self.identifier}`" label="其它" value="other" v-model="singleChoice" />
            </template>
            <Box padding-block-start="200" v-if="isChecked['other']">
                <TextField size="slim" v-model="otherValue" auto-complete="off"
                    :placeholder="self.config.otherLabel || '输入你的答案'" />
            </Box>
        </BlockStack>
    </FormElement>
</template>