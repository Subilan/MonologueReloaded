<script setup lang="ts">
  import CardTitle from '@/components/CardTitle.vue';
  import Draggable from '@/components/Draggable.vue';
  import Choice from '@/components/form-elements/Choice.vue';
  import Select from '@/components/form-elements/Select.vue';
  import TextInput from '@/components/form-elements/TextInput.vue';
  import FormElementShortcut from '@/components/FormElementShortcut.vue';
import { CheckboxIcon, CursorOptionIcon } from '@/icons';
  import router from '@/router';
  import { BlockStack, Box, Card, Icon, InlineGrid, Layout, LayoutSection, Page, Text } from '@ownego/polaris-vue';
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
            <InlineGrid columns="1fr 1fr" gap="400">
              <FormElementShortcut>
                <Icon :source="CursorOptionIcon" />
                单选题
              </FormElementShortcut>
              <FormElementShortcut>
                <Icon :source="CheckboxIcon"/>
                多选题
              </FormElementShortcut>
            </InlineGrid>
          </Card>
          <BlockStack gap="400">
            <Draggable>
              <Choice ref="exampleChoice" title="示例选择题" multiple :index="1" other />
            </Draggable>
            <Select ref="exampleSelect" title="示例下拉题" :index="2" helper-text="昨天，今天还是明天？" :options="[
              { label: 'Today', value: 'today' },
              { label: 'Yesterday', value: 'yesterday' },
              { label: 'Last 7 days', value: 'lastWeek' },
            ]" />
            <TextInput ref="exampleTextInput" title="示例填空题" :index="3" helper-text="在此输入" placeholder="占位符" :lines="5"
              :checks="[
                {
                  r: /^[A-Za-z0-9]+$/,
                  error: 'regex1 test failed'
                },
              ]
                " />
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