<script setup lang="ts">
    import { Text, Card, Layout, LayoutSection, Page, InlineGrid, Box } from '@ownego/polaris-vue';

</script>

<template>
    <Page title="仪表盘">
        <Layout>
            <LayoutSection>
                <Card roundedAbove="sm">
                    <Box padding-block-end="200">
                        <Text as="h2" variant="headingSm">
                            基本信息
                        </Text>
                    </Box>
                    <InlineGrid :columns="3">
                        <Box>
                            <Text as="h3" variant="bodyMd">问卷数量</Text>
                            <Text as="p" variant="heading2xl">32</Text>
                        </Box>
                        <Box>
                            <Text as="h3" variant="bodyMd">投票数量</Text>
                            <Text as="p" variant="heading2xl">32</Text>
                        </Box>
                    </InlineGrid>
                </Card>
            </LayoutSection>
        </Layout>
    </Page>
</template>