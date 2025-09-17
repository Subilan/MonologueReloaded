<script setup lang="ts">
  import CardSectionTitle from '@/components/CardSectionTitle.vue';
  import CardTitle from '@/components/CardTitle.vue';
  import FormElementShortcut from '@/components/FormElementShortcut.vue';
  import FormElementShortcutContainer from '@/components/FormElementShortcutContainer.vue';
  import { IconDropdown, IconMultipleChoice, IconTextInput, IconSingleChoice, IconParagraphInput, IconTextInputMultiple, IconSlider, IconStar } from '@/icons';
  import { type FormElement, newElement } from '@/models/form/Form';
  import router from '@/router';
  import { Badge, Card, Icon, InlineGrid, Layout, LayoutSection, Page } from '@ownego/polaris-vue';
  import makeId from '@/func/makeId';
  import { ref, watch } from 'vue';
  import BuilderForm from '@/components/builder/BuilderForm.vue';
  import useFormElementDraggable from '@/composables/useFormElementDraggable';
  import { FormElementGroupMap, FormElementInfo } from '@/static/FormElement';

  const dragMode = ref(false);

  const formElements = ref<FormElement[]>([
    newElement('choice', {
      isMultiple: true,
      hasOther: true,
      choices: [{
        label: 'aaa',
        value: 'aaa'
      }]
    }),
    newElement('select', {
      helperText: '昨天，今天，还是明天？',
      options: [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 days', value: 'lastWeek' },
      ]
    }),
    newElement('text_input', {
      fields: [
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
    }),
    newElement('paragraph_input', {
      template: `Hello, my name is [type=text,required] and I am from [], I'm [type=number,min=1,max=120,required]. My favorite food is [type=select,options{apple:'orange juice':'bla bla bla'}] and my favorite singer is [].`

    }),
    newElement('text_input', {
      fields: [
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
    }),
    newElement('slider', {
      isRange: false,
      output: true,
      maxValue: 5,
      suffix: 'test suffix',
      prefix: 'test prefix',
    }),
    newElement('rating', {
      ratingMessages: ['很差', '较差', '一般', '较好', '很好'],
      levels: 5
    })
  ]);

  formElements.value.forEach(v => {
    v.identifier = makeId(10);
  });

  const emptyFormElements = ref([]);

  async function save() {

  }

  const formElementDraggable = useFormElementDraggable();

  watch(dragMode, v => formElementDraggable.value = v, { immediate: true });
</script>

<template>
  <Page full-width style="max-width: 2000px;" title="创建问卷" :back-action="{ onAction() { router.go(-1) } }"
    :primary-action="{
      content: '保存',
      onAction: save
    }" :action-groups="[
      {
        title: '编辑器',
        actions: [
          {
            content: '拖拽模式',
            helpText: '可自由拖拽控件和组件',
            active: dragMode,
            onAction() {
              dragMode = !dragMode;
            }
          }
        ]
      }
    ]">
    <Layout>
      <LayoutSection>
        <InlineGrid columns="1fr 3fr 1fr" gap="400" align-items="start">
          <Card style="z-index: var(--p-z-index-1);">
            <CardTitle no-padding-block-end>
              表单元素
            </CardTitle>

            <template v-for="[groupName, groupTypes] in Object.entries(FormElementGroupMap)">
              <CardSectionTitle>
                {{ groupName }}
              </CardSectionTitle>

              <FormElementShortcutContainer>
                <FormElementShortcut :description="FormElementInfo[type].description" :type="type" v-for="type in groupTypes">
                  <Icon :source="FormElementInfo[type].icon" />
                  {{ FormElementInfo[type].name }}
                </FormElementShortcut>
              </FormElementShortcutContainer>
            </template>
          </Card>
          <BuilderForm :drag-disabled="!dragMode" v-model="emptyFormElements" />
          <Card>
            <CardTitle>
              元素属性
            </CardTitle>
          </Card>
        </InlineGrid>
      </LayoutSection>
    </Layout>
  </Page>
</template>