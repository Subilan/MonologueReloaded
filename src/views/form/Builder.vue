<script setup lang="ts">
  import CardSectionTitle from '@/components/CardSectionTitle.vue';
  import CardTitle from '@/components/CardTitle.vue';
  import FormElementShortcut from '@/components/FormElementShortcut.vue';
  import FormElementShortcutContainer from '@/components/FormElementShortcutContainer.vue';
  import { IconDropdown, IconMultipleChoice, IconTextInput, IconSingleChoice, IconParagraphInput, IconTextInputMultiple, IconSlider, IconStar } from '@/icons';
  import type { FormElements, FormElementType } from '@/models/form/Form';
  import router from '@/router';
  import { BlockStack, Card, Icon, InlineGrid, Layout, LayoutSection, Page } from '@ownego/polaris-vue';
  import { onMounted, useTemplateRef, watch } from 'vue';
  import Choice from '@/components/form-elements/Choice.vue';
  import Select from '@/components/form-elements/Select.vue';
  import Rating from '@/components/form-elements/Rating.vue';
  import Slider from '@/components/form-elements/Slider.vue';
  import TextInput from '@/components/form-elements/TextInput.vue';
  import ParagraphInput from '@/components/form-elements/ParagraphInput.vue';
  import draggingElement from '@/draggingElement';
  import Rect from '@/func/rect';
  import type { RectObject } from '@/types';

  function getComponent(type: FormElementType) {
    switch (type) {
      case 'choice': return Choice;
      case 'select': return Select;
      case 'text_input': return TextInput;
      case 'paragraph_input': return ParagraphInput;
      case 'slider': return Slider;
      case 'rating': return Rating;
    }
  }

  const objects: FormElements.Object[] = [
    {
      type: 'choice',
      isMultiple: true,
      hasOther: true,
      choices: [{
        label: 'aaa',
        value: 'aaa'
      }]
    },
    {
      type: 'select',
      helperText: '昨天，今天，还是明天？',
      options: [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 days', value: 'lastWeek' },
      ]
    },
    {
      type: 'text_input',
      configs: [
        {
          helperText: '在此输入',
          placeholder: '占位符',
          multiline: 5,
          autoComplete: 'off'
        }
      ],
      checks: [
        [{
          r: /^[A-Za-z0-9]+$/,
          error: 'regex1 test failed'
        },]
      ]
    },
    {
      type: 'paragraph_input',
      template: `Hello, my name is [type=text,required] and I am from [], I'm [type=number,min=1,max=120,required]. My favorite food is [type=select,options{apple:'orange juice':'bla bla bla'}] and my favorite singer is [].`
    },
    {
      type: 'text_input',
      configs: [
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
      ],
      checks: [
        [],
        [],
        [{
          r: /^\d+$/,
          error: '不全为数字'
        }],
        []
      ]
    },
    {
      type: 'slider',
      isRange: false,
      output: true,
      maxValue: 5,
      suffix: 'test suffix',
      prefix: 'test prefix',
    },
    {
      type: 'rating',
      ratingMessages: ['很差', '较差', '一般', '较好', '很好'],
      levels: 5
    }
  ];

  const objectRefs = useTemplateRef('formObjects');

  async function save() {
    const values = objectRefs.value?.map(x => x?.get());
    console.log(values)
  }

  let objectRects: RectObject[] = [];

  function updateObjectRects() {
    objectRects = objectRefs.value?.map((x, i) => {
      let target = x?.$el.nextSibling as HTMLElement;
      if (!target) return { x: 0, y: 0, w: 0, h: 0, id: -1 };
      const rect = target.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
        id: i
      }
    }) || [];
  }

  onMounted(() => {
    updateObjectRects();

    document.addEventListener('scroll', e => updateObjectRects());
  })


  watch(draggingElement, el => {
    if (el.id === -1) return;
    if (!el.isDragging || !el.isChanging) return;
    const draggingRect = objectRects[el.id];
    const inEl = objectRects.filter(r => r.id !== el.id && Rect.withObject({
      x: el.x,
      y: el.y,
      w: draggingRect.w,
      h: draggingRect.h
    }).isIn(Rect.withObject(r)));
    if (inEl.length === 0) return;
    let tgEl = inEl[inEl.length - 1];
    console.log(el.x, el.y, tgEl.x, tgEl.y, tgEl.x + tgEl.w, tgEl.y + tgEl.h, `id=${tgEl.id}`)
  })
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
            <!-- @vue-ignore -->
            <component v-for="(obj, i) in objects" ref="formObjects" :is="getComponent(obj.type)" :config="obj"
              :index="i + 1" :title="obj.title || 'default title'" :description="obj.description" />
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