<template>
    <Button :variant="variant" style="width: 100%;">
        <slot />
    </Button>
</template>

<script lang="ts" setup>
import { Button } from '@ownego/polaris-vue';
import type { PropType } from 'vue';

const props = defineProps({
    variant: {
        type: String as PropType<'primary' | 'secondary' | 'tertiary'>,
        default: 'primary'
    }
})
</script>