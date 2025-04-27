<script setup lang="ts">
  import CardTitle from '@/components/CardTitle.vue';
  import Choice from '@/components/form-elements/Choice.vue';
  import Select from '@/components/form-elements/Select.vue';
  import router from '@/router';
  import { BlockStack, Box, Card, InlineGrid, Layout, LayoutSection, Page, Text } from '@ownego/polaris-vue';
  import { useTemplateRef } from 'vue';

  const exampleChoiceRef = useTemplateRef('exampleChoice');
  const exampleSelect = useTemplateRef('exampleSelect');

  async function save() {
    console.log(exampleSelect.value?.get());
  }
</script>

<template>
  <Page full-width title="创建问卷" :back-action="{ onAction() { router.go(-1) } }" :primary-action="{
    content: '保存',
    onAction: save
  }">
    <Layout>
      <LayoutSection>
        <InlineGrid columns="1fr 2fr 1fr" gap="400" align-items="start">
          <Card>
            <CardTitle>
              问卷控件
            </CardTitle>
          </Card>
          <BlockStack gap="400">
            <Choice ref="exampleChoice" title="示例选择题" multiple :index="1" other description="<p><b>示例下拉题介绍</b>介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容介绍内容</p>" />
            <Select ref="exampleSelect" title="示例下拉题" :index="2" helper-text="昨天，今天还是明天？" />
          </BlockStack>
          <Card>
            <CardTitle>
              控件属性
            </CardTitle>
          </Card>
        </InlineGrid>
      </LayoutSection>
    </Layout>
  </Page>
</template>