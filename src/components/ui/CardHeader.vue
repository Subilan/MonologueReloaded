<template>
    <Box padding-block-end="200">
        <InlineStack>
            <CardTitle no-padding-block-end><slot/></CardTitle>
            <div class="spacer" />
            <Button variant="tertiary" :icon="Close" @click="$emit('close')"></Button>
        </InlineStack>
    </Box>
</template>

<script lang="ts" setup>
import { Close } from '@/icons';
import CardTitle from '../CardTitle.vue';
</script>