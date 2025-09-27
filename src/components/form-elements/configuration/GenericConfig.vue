<template>
    <component :is="targetComponent" v-model="model" />
</template>

<script lang="ts" setup>
import type { FormElement, FormElementType } from '@/models/form/Form';
import ChoiceConfig from './ChoiceConfig.vue';
import { computed } from 'vue';
import SelectConfig from './SelectConfig.vue';
import TextInputConfig from './TextInputConfig.vue';
import ParagraphInputConfig from './ParagraphInputConfig.vue';
import RatingConfig from './RatingConfig.vue';
import SliderConfig from './SliderConfig.vue';

const model = defineModel<FormElement>({ required: true });

const map: Record<FormElementType, any> = {
    'choice': ChoiceConfig,
    select: SelectConfig,
    text_input: TextInputConfig,
    paragraph_input: ParagraphInputConfig,
    slider: SliderConfig,
    rating: RatingConfig,
    unknown: undefined
}

const targetComponent = computed(() => map[model.value.type])
</script>