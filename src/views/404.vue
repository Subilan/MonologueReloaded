<script setup lang="ts">
    import router from '@/router';
    import { BlockStack, EmptyState, Layout, LayoutSection, Link, Page } from '@ownego/polaris-vue';
</script>

<template>
    <Page>
        <Layout>
            <LayoutSection>
                <BlockStack align="center" inline-align="center" style="height: 100dvh">
                    <Card class="constraint__emptyStateCard">
                        <EmptyState heading="你要访问的页面不存在" :action="{ content: '回到上一页', onAction: () => router.go(-1) }"
                            image="/images/webpage-not-available-bleed.png">
                            <p>“{{ `/${$route.params.any}` }}” 不是一个有效的位置。请检查地址拼写是否有误。</p>
                            <template #footerContent>
                                <p>如果该问题不应出现，请
                                    <Link monochrome url="/feedback">反馈</Link>。
                                </p>
                            </template>
                        </EmptyState>
                    </Card>
                </BlockStack>
            </LayoutSection>
        </Layout>
    </Page>
</template>

<style lang="scss">
.constraint__emptyStateCard {
    @media (min-width: 30.625em) {
        width: 500px;
    }

    @media (max-width: 30.6225em) {
        width: 80%;
    }
}
</style>