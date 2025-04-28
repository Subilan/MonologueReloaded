<script setup lang="ts">
import { Box, Divider } from '@ownego/polaris-vue';

</script>

<template>
    <Box padding-block-end="200" padding-block-start="200">
        <Text as="p" variant="bodyMd">
            <slot/>
        </Text>
    </Box>
</template>