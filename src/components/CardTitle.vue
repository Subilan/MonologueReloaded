<script setup lang="ts">
    import { Box } from '@ownego/polaris-vue';

</script>

<template>
    <Box padding-block-end="200">
        <Text variant="headingMd" as="h2">
            <slot />
        </Text>
    </Box>
</template>