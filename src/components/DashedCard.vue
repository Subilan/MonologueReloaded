<template>
    <div class="dashed-card">
        <slot />
    </div>
</template>

<style lang="scss">
.dashed-card {
    display: block;
    border-radius: var(--p-border-radius-200);
    border: 1px dashed var(--p-color-border-tertiary);
    padding: 8px;
}
</style>