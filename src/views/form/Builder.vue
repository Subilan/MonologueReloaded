<script setup lang="ts">
  import CardSectionTitle from '@/components/CardSectionTitle.vue';
  import CardTitle from '@/components/CardTitle.vue';
  import Draggable from '@/components/Draggable.vue';
  import Choice from '@/components/form-elements/Choice.vue';
  import ParagraphInput from '@/components/form-elements/ParagraphInput.vue';
  import Rating from '@/components/form-elements/Rating.vue';
  import Select from '@/components/form-elements/Select.vue';
  import Slider from '@/components/form-elements/Slider.vue';
  import TextInput from '@/components/form-elements/TextInput.vue';
  import TextInputMultiple from '@/components/form-elements/TextInputMultiple.vue';
  import FormElementShortcut from '@/components/FormElementShortcut.vue';
  import FormElementShortcutContainer from '@/components/FormElementShortcutContainer.vue';
  import { IconDropdown, IconMultipleChoice, IconTextInput, IconSingleChoice, IconParagraphInput, IconTextInputMultiple, IconSlider, IconStar } from '@/icons';
  import router from '@/router';
  import { BlockStack, Card, Icon, InlineGrid, Layout, LayoutSection, Page } from '@ownego/polaris-vue';
  import { useTemplateRef } from 'vue';

  const exampleChoiceRef = useTemplateRef('exampleChoice');
  const exampleSelect = useTemplateRef('exampleSelect');
  const exampleTextInput = useTemplateRef('exampleTextInput');
  const exampleParagraphInput = useTemplateRef('exampleParagraphInput');
  const exampleTextInputMultiple = useTemplateRef('exampleTextInputMultiple');
  const exampleRating = useTemplateRef('exampleRating');

  async function save() {
    console.log(exampleRating.value?.get());
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
                <Icon :source="IconTextInputMultiple" />
                多重填空
              </FormElementShortcut>
              <FormElementShortcut>
                <Icon :source="IconParagraphInput" />
                段落填空
              </FormElementShortcut>
            </FormElementShortcutContainer>
            <CardSectionTitle>
              评估
            </CardSectionTitle>
            <FormElementShortcutContainer>
              <FormElementShortcut>
                <Icon :source="IconSlider" />
                滑块
              </FormElementShortcut>
              <FormElementShortcut>
                <Icon :source="IconStar" />
                评分
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
            <TextInput ref="exampleTextInput" title="示例填空题" :index="3" :config="{
              helperText: '在此输入',
              placeholder: '占位符',
              multiline: 5,
              autoComplete: 'off'
            }" :check="[
              {
                r: /^[A-Za-z0-9]+$/,
                error: 'regex1 test failed'
              },
            ]" />
            <ParagraphInput
              :template="`Hello, my name is [type=text,required] and I am from [], I'm [type=number,min=1,max=120,required]. My favorite food is [type=select,options{apple:'orange juice':'bla bla bla'}] and my favorite singer is [].`"
              ref="exampleParagraphInput" title="示例段落填空题" :index="4" />
            <TextInputMultiple ref="exampleTextInputMultiple" title="示例多重填空题" :index="5" :configs="[
              {
                autoComplete: 'off'
              },
              {
                autoComplete: 'off',
                multiline: 6
              },
              {
                autoComplete: 'off',
                label: '只能是数字'
              },
              {
                autoComplete: 'off'
              },
            ]" :checks="[
              [],
              [],
              [{
                r: /^\d+$/,
                error: '不全为数字'
              }],
              []
            ]" />
            <Slider title="示例滑块题" :index="6" ref="exampleSlider" output :max="5" suffix="222" />
            <Rating title="示例评分题" :index="7" ref="exampleRating" />
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