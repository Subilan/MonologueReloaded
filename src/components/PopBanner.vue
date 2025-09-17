<script setup lang="ts">
    import { Banner, LayoutSection } from '@ownego/polaris-vue';
    import { ref, type PropType } from 'vue';
    import type {Tone} from "@/types/Common.ts";

    const props = defineProps({
        tone: {
            type: Object as PropType<Tone>,
            default: 'info'
        },
        title: {
            type: String
        },
        useLayoutSection: {
            type: Boolean,
            default: false
        }
    })

    function raise(msg: string) {
        bannerContent.value = msg;
    }

    function clear() {
        bannerContent.value = '';
    }

    const bannerContent = ref('');

    defineExpose({
        raise,
        clear,
        bannerContent
    });
</script>

<template>
    <template v-if="useLayoutSection">
        <LayoutSection v-if="bannerContent.length > 0">
            <Banner :tone="tone" :title="title">
                <p>{{ bannerContent }}</p>
            </Banner>
        </LayoutSection>
    </template>
    <template v-else>
        <Banner :tone="tone" :title="title" v-if="bannerContent.length > 0">
            <p>{{ bannerContent }}</p>
        </Banner>
    </template>
</template>