<template>
    <InlineGrid gap="400" columns="auto 1fr 1fr auto">
        <DragHandle />
        <TextField auto-complete="off" placeholder="输入正则表达式" :error="regexError" v-model="regexConfig.r" />
        <TextField auto-complete="off" placeholder="错误提示信息" v-model="regexConfig.error" />
        <Button @click="$emit('remove', regexConfig.id)" :icon="Close" variant="tertiary" />
    </InlineGrid>
</template>

<script lang="ts" setup>
import DragHandle from '@/components/ui/DragHandle.vue';
import { Close } from '@/icons';
import type { WithId } from '@/models/base/basic';
import type { TextInputCheck } from '@/models/form/elements/TextInput';
import { InlineGrid, TextField } from '@ownego/polaris-vue';
import { ref, watch } from 'vue';

const regexConfig = defineModel<WithId<TextInputCheck>>({ required: true });
const regexError = ref(false);

watch(() => regexConfig.value.r, v => {
    try {
        new RegExp(v);
    } catch (e) {
        regexError.value = true;
        return;
    }

    regexError.value = false;
});

defineEmits(['remove'])
</script>