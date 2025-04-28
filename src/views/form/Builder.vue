<script setup lang="ts">
  import CardSectionTitle from '@/components/CardSectionTitle.vue';
  import CardTitle from '@/components/CardTitle.vue';
  import Draggable from '@/components/Draggable.vue';
  import Choice from '@/components/form-elements/Choice.vue';
  import ParagraphInput from '@/components/form-elements/ParagraphInput.vue';
  import Select from '@/components/form-elements/Select.vue';
  import TextInput from '@/components/form-elements/TextInput.vue';
  import FormElementShortcut from '@/components/FormElementShortcut.vue';
  import FormElementShortcutContainer from '@/components/FormElementShortcutContainer.vue';
  import { IconDropdown, IconMultipleChoice, IconTextInput, IconSingleChoice, IconParagraphInput, IconTextInputMultiple } from '@/icons';
  import router from '@/router';
  import { BlockStack, Box, Card, Icon, InlineGrid, Layout, LayoutSection, Page, Text } from '@ownego/polaris-vue';
  import { useTemplateRef } from 'vue';

  const exampleChoiceRef = useTemplateRef('exampleChoice');
  const exampleSelect = useTemplateRef('exampleSelect');
  const exampleParagraphInput = useTemplateRef('exampleParagraphInput');

  async function save() {
    console.log(exampleParagraphInput.value?.get());
  }

</script>

<template>
  <Page full-width style="max-width: 2000px;" title="创建问卷" :back-action="{ onAction() { router.go(-1) } }"
    :primary-action="{
      content: '保存',
      onAction: save
    }">
    <Layout>
      <LayoutSection>
        <InlineGrid columns="1fr 3fr 1fr" gap="400" align-items="start">
          <Card style="z-index: var(--p-z-index-1);">
            <CardTitle no-padding-block-end>
              问卷控件
            </CardTitle>
            <CardSectionTitle>
              选择
            </CardSectionTitle>
            <FormElementShortcutContainer>
              <FormElementShortcut>
                <Icon :source="IconSingleChoice" />
                单选题
              </FormElementShortcut>
              <FormElementShortcut>
                <Icon :source="IconMultipleChoice" />
                多选题
              </FormElementShortcut>
              <FormElementShortcut>
                <Icon :source="IconDropdown" />
                下拉选择
              </FormElementShortcut>
            </FormElementShortcutContainer>
            <CardSectionTitle>
              填空
            </CardSectionTitle>
            <FormElementShortcutContainer>
              <FormElementShortcut>
                <Icon :source="IconTextInput" />
                简单填空
              </FormElementShortcut>
              <FormElementShortcut>
                <Icon :source="IconTextInputMultiple"/>
                多重填空
              </FormElementShortcut>
              <FormElementShortcut>
                <Icon :source="IconParagraphInput"/>
                段落填空
              </FormElementShortcut>
            </FormElementShortcutContainer>
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
            <ParagraphInput :template="`Hello, my name is [type=text,required] and I am from [], I'm [type=number,min=1,max=120,required]. My favorite food is [type=select,options{apple:'orange juice':'bla bla bla'}] and my favorite singer is [].`" ref="exampleParagraphInput" title="示例段落填空题" :index="4" />
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