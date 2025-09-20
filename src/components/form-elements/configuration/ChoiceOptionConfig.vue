<template>
    <InlineGrid columns="1fr auto" gap="400" align-items="start">
        <BlockStack gap="400">
            <TextField v-model="choiceValue" auto-complete="off" placeholder="选项值" required-indicator />
            <TextField v-model="model.helpText" auto-complete="off" placeholder="提示文本" />
        </BlockStack>
         <BlockStack gap="200">
            <Button @click="$emit('remove', model.id)" variant="tertiary" tone="critical" :icon="Close" />
            <DragHandle />
        </BlockStack>
    </InlineGrid>
</template>

<script lang="ts" setup>
    import DragHandle from '@/components/ui/DragHandle.vue';
    import { Close } from '@/icons';
    import type { ChoiceOption } from '@/models/form/elements/Choice';
    import { BlockStack, Button, InlineGrid, TextField } from '@ownego/polaris-vue';
    import { ref, watch } from 'vue';

    const model = defineModel<ChoiceOption>({ required: true })

    const choiceValue = ref(model.value.label);

    watch(choiceValue, v => {
        model.value.label = v;
        model.value.value = v;
    })

    defineEmits(['remove'])
</script>