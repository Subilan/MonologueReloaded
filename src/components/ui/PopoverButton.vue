<script setup lang="ts">
import { Box, Popover } from '@ownego/polaris-vue';
import { ref, type PropType } from 'vue';

const props = defineProps({
    variant: {
        type: String as PropType<'primary' | 'secondary' | 'tertiary'>,
        default: 'secondary'
    }
})

const active = ref(false);

function togglePopoverActive() {
    active.value = !active.value;
}
</script>

<template>
    <Popover :active="active" autofocus-target="first-node" @close="togglePopoverActive">
        <template #activator>
            <Button :variant="variant" @click="togglePopoverActive">
                <slot />
            </Button>
        </template>
        <Box padding="400">
            <slot name="content" />
        </Box>
    </Popover>
</template>