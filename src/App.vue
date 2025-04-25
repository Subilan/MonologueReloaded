<script setup lang="ts">
import { AppProvider } from '@ownego/polaris-vue';
import locales from '@ownego/polaris-vue/dist/locales/zh-CN.json'

</script>

<template>
  <AppProvider :i18n="locales">
    <RouterView/>
  </AppProvider>
</template>