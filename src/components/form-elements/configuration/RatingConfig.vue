<script setup lang="ts">
import type { FormElement } from '@/models/form/Form';
import Config from './Config.vue';
import { Box, Checkbox, RangeSlider, Tabs, TextField } from '@ownego/polaris-vue';
import { ref, watch } from 'vue';
import CardTitle from '@/components/CardTitle.vue';

const ratingConfig = defineModel<FormElement<'rating'>>({ required: true });

const ratingLevelNamingCustomizedText = ref(ratingConfig.value.config.ratingMessages.join(','));
const useRatingLevelNamingTemplate = ref(false);

watch(useRatingLevelNamingTemplate, v => {
    if (!v) ratingConfig.value.config.ratingMessageTemplate = undefined;
})

watch(ratingLevelNamingCustomizedText, v => {
    ratingConfig.value.config.ratingMessages = v.split(',');
})
</script>

<template>
    <Config v-model="ratingConfig">
        <RangeSlider v-model="ratingConfig.config.levels" :min="2" :max="10" label="分级数量" help-text="设置一共分多少级" />
        <Checkbox label="使用分级名称模板" v-model="useRatingLevelNamingTemplate" />
        <TextField v-if="useRatingLevelNamingTemplate" auto-complete="off" help-text="输入分级名称模板"
            v-model="ratingConfig.config.ratingMessageTemplate" placeholder="用 $i 表示分级序号" />
        <TextField v-else auto-complete="off" help-text="输入各个级别的名称以提供提示，用半角逗号分隔"
            v-model="ratingLevelNamingCustomizedText" placeholder="键入用半角逗号分隔的分级名称" />
    </Config>
</template>