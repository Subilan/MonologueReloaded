<script setup lang="ts">
    import useLang from '@/func/useLang';
    import router from '@/router';
    import { Card, EmptyState, Layout, LayoutSection, Page } from '@ownego/polaris-vue';
    const { t, n, d } = useLang();
</script>

<template>
    <Page :title="t('common.form')" :subtitle="t('common.overall')" :primary-action="{
        content: t('common.new'),
        onAction() {
            router.push({ name: 'form-builder' })
        }
    }" :back-action="{
        onAction() {
            router.go(-1);
        }
    }">
        <Layout>
            <LayoutSection>
                <Card>
                    <EmptyState :heading="t('ui.form_overall.emptystate_title')" image="/images/empty-page.png">
                        <p>{{ t('ui.form_overall.emptystate_desc') }}</p>
                    </EmptyState>
                </Card>
            </LayoutSection>
        </Layout>
    </Page>
</template>