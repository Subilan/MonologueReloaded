<script setup lang="ts">
  import CardSectionTitle from '@/components/CardSectionTitle.vue';
  import CardTitle from '@/components/CardTitle.vue';
  import FormElementShortcut from '@/components/FormElementShortcut.vue';
  import FormElementShortcutContainer from '@/components/FormElementShortcutContainer.vue';
  import { type FormElement, newElement } from '@/models/form/Form';
  import router from '@/router';
  import { BlockStack, Card, Checkbox, Dd, DescriptionList, Dt, Icon, InlineGrid, Layout, LayoutSection, Page, Tooltip } from '@ownego/polaris-vue';
  import { reactive, ref, useTemplateRef } from 'vue';
  import BuilderForm from '@/components/builder/BuilderForm.vue';
  import useFormElementDraggable from '@/composables/useFormElementDraggable';
  import { FormElementGroupMap, FormElementInfo } from '@/static/FormElement';
  import Dlg from '@/components/ui/Dlg.vue';
  import type BuilderFormSettings from '@/types/BuilderFormSettings';

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

  const emptyFormElements = ref([]);

  async function save() {

  }

  const formElementDraggable = useFormElementDraggable();

  const builderFormRef = useTemplateRef('builder_form_ref');

  const modalSettings = ref(false);

  const builderFormSettings = reactive<BuilderFormSettings>({
    showIndex: false
  });
</script>

<template>
  <Page full-width style="max-width: 2000px;" title="创建问卷" :back-action="{ onAction() { router.go(-1) } }"
    :primary-action="{
      content: '保存',
      onAction: save
    }" :secondary-actions="[
      {
        content: '设置',
        onAction() {
          modalSettings = true;
        }
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
                <FormElementShortcut :onclick="() => builderFormRef?.appendEmptyFormElement(type)"
                  :description="FormElementInfo[type].description" :type="type" v-for="type in groupTypes">
                  <Icon :source="FormElementInfo[type].icon" />
                  {{ FormElementInfo[type].name }}
                </FormElementShortcut>
              </FormElementShortcutContainer>
            </template>
          </Card>
          <BuilderForm v-model:settings="builderFormSettings" ref="builder_form_ref" v-model="formElements" />
          <BlockStack gap="400">
            <Card>
              <CardTitle>
                表单总览
              </CardTitle>
              <DescriptionList gap="tight">
                <Dt>元素个数</Dt>
                <Dd>{{ formElements.length }}</Dd>
                <Dt>创建者</Dt>
                <Dd>
                  Abc
                </Dd>
                <Dt>创建时间</Dt>
                <Dd>
                  <Tooltip :content="`1970-01-01 13:00:00`">13 天前</Tooltip>
                </Dd>
                <Dt>最近保存</Dt>
                <Dd>
                  <Tooltip :content="`1970-01-01 13:00:00`">刚刚</Tooltip>
                </Dd>
              </DescriptionList>
            </Card>
          </BlockStack>
        </InlineGrid>
      </LayoutSection>
    </Layout>
  </Page>

  <Dlg v-model="modalSettings" title="表单设置">
    <CardTitle>
      基础设置
    </CardTitle>
    <InlineGrid columns="1fr 1fr" gap="400">
      <Checkbox v-model="builderFormSettings.showIndex" label="显示编号" help-text="是否自动为表单元素编号并显示在标题的左侧" />
    </InlineGrid>
  </Dlg>
</template>