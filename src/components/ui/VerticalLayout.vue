<template>
    <div class="vertical-layout">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.vertical-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>