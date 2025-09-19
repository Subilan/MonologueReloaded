<template>
    <Icon :source="Drag" class="drag-handle" />
</template>

<script lang="ts" setup>
    import { Drag } from '@/icons';
</script>

<style lang="scss">
.drag-handle {
    cursor: move;
}
</style>