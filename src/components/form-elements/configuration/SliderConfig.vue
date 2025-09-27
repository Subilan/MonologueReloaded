<script setup lang="ts">
import type { FormElement } from '@/models/form/Form';
import Config from './Config.vue';
import { Checkbox, InlineGrid, TextField } from '@ownego/polaris-vue';
import NumberTextField from '@/components/ui/NumberTextField.vue';

const sliderConfig = defineModel<FormElement<'slider'>>({ required: true })
</script>

<template>
    <Config v-model="sliderConfig">
        <InlineGrid gap="400" columns="1fr 1fr 1fr">
            <NumberTextField v-model="sliderConfig.config.minValue" label="最小值" />
            <NumberTextField v-model="sliderConfig.config.maxValue" label="最大值" />
            <NumberTextField v-model="sliderConfig.config.step" :min="1" label="间隔" />
        </InlineGrid>
        <InlineGrid gap="400" columns="1fr 1fr">
            <TextField auto-complete="off" label="前缀文本" v-model="sliderConfig.config.prefix" placeholder="输入文本" />
            <TextField auto-complete="off" label="后缀文本" v-model="sliderConfig.config.suffix" placeholder="输入文本" />
        </InlineGrid>
        <TextField auto-complete="off" label="滑块标签" help-text="显示于滑块左上角的标签文本" placeholder="输入文本"
            v-model="sliderConfig.config.label" />
        <Checkbox label="随滑块显示数字" v-model="sliderConfig.config.output" />
        <Checkbox label="范围滑块" v-model="sliderConfig.config.isRange" />
    </Config>
</template>