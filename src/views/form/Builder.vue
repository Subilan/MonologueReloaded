<script setup lang="ts">
import CardSectionTitle from '@/components/CardSectionTitle.vue';
import CardTitle from '@/components/CardTitle.vue';
import FormElementShortcut from '@/components/FormElementShortcut.vue';
import FormElementShortcutContainer from '@/components/FormElementShortcutContainer.vue';
import { type FormElement, newElement } from '@/models/form/Form';
import router from '@/router';
import { BlockStack, Card, Checkbox, Dd, DescriptionList, Dt, FormLayout, Icon, InlineGrid, Layout, LayoutSection, Page, Select, Tooltip } from '@ownego/polaris-vue';
import { computed, onMounted, reactive, ref, Transition, useTemplateRef, watch } from 'vue';
import BuilderForm from '@/components/builder/BuilderForm.vue';
import useFormElementDraggable from '@/composables/useFormElementDraggable';
import { FormElementGroupMap, FormElementInfo } from '@/static/FormElement';
import Dlg from '@/components/ui/Dlg.vue';
import GenericConfig from '@/components/form-elements/configuration/GenericConfig.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import { v4 } from 'uuid';
import { BFIndexFormatOptions, BFIndicatorStyleOptions, BuilderFormSettingsDefault } from '@/static/BuilderFormSettings';
import useBuilderFormSettings from '@/composables/useBuilderFormSettings';
import PopoverButton from '@/components/ui/PopoverButton.vue';
import VerticalLayout from '@/components/ui/VerticalLayout.vue';

const formElements = ref<FormElement[]>([
  newElement('choice', {
    isMultiple: true,
    hasOther: true,
    choices: [{
      label: 'aaa',
      value: 'aaa',
      id: v4()
    }]
  }),
  newElement('select', {
    helperText: '昨天，今天，还是明天？',
    options: [
      {
        label: 'Today',
        id: v4()
      },
      {
        label: 'Tomorrow',
        id: v4()
      },
      {
        label: 'Yesterday',
        id: v4()
      }
    ]
  }),
  newElement('text_input', {
    fields: [
      {
        helperText: '在此输入',
        placeholder: '占位符',
        multiline: 5,
        autoComplete: 'off',
        regex: [
          {
            r: '^[A-Za-z0-9]+$',
            error: 'regex1 test failed',
            id: v4()
          }
        ],
        id: v4()
      }
    ],
  }),
  newElement('paragraph_input', {
    template: `Hello, my name is [type=text,required] and I am from [], I'm [type=number,min=1,max=120,required]. My favorite food is [type=select,options{apple:'orange juice':'bla bla bla'}] and my favorite singer is [].`

  }),
  newElement('text_input', {
    fields: [
      {
        autoComplete: 'off',
        id: v4()

      },
      {
        autoComplete: 'off',
        multiline: 6,
        id: v4()

      },
      {
        autoComplete: 'off',
        label: '只能是数字',
        regex: [
          {
            r: '^\\d+$',
            error: '不全为数字',
            id: v4()
          }
        ],
        id: v4()
      },
      {
        autoComplete: 'off',
        id: v4()
      },
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

async function save() {

}

const formElementDraggable = useFormElementDraggable();

const builderFormRef = useTemplateRef('builder_form_ref');

const modalSettings = ref(false);

const builderFormSettings = useBuilderFormSettings();

watch(() => builderFormSettings.indexFormat, v => {
  if (v === 'hanzi') {
    // 默认值
    builderFormSettings.indexFormatConfig['lowercase'] = true;
  }
})

const builderFormSelection = reactive<Record<number, boolean>>({});
const builderFormSelectedIndex = computed(() => {
  for (let [index, value] of Object.entries(builderFormSelection)) {
    if (value) return Number(index);
  }

  return -1;
})
const builderFormSelectedElement = computed(() => {
  if (builderFormSelectedIndex.value !== -1) {
    return formElements.value[builderFormSelectedIndex.value];
  }

  return null;
})

watch(builderFormSelectedIndex, v => console.log(v));

function resetBuilderFormSelectedIndex() {
  // @ts-ignore
  Object.keys(builderFormSelection).forEach(k => builderFormSelection[k] = false);
}

onMounted(() => {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && builderFormSelectedIndex.value !== -1) {
      e.preventDefault();
      resetBuilderFormSelectedIndex();
    }
  })
})
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
          <BuilderForm v-model:selection="builderFormSelection" ref="builder_form_ref" v-model="formElements" />
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
            <Transition name="fade-from-right">
              <Card id="element-configuration" v-if="builderFormSelectedElement !== null">
                <CardHeader @close="resetBuilderFormSelectedIndex">元素设置</CardHeader>
                <GenericConfig v-model="formElements[builderFormSelectedIndex]" />
              </Card>
            </Transition>
          </BlockStack>
        </InlineGrid>
      </LayoutSection>
    </Layout>
  </Page>

  <Dlg v-model="modalSettings" title="表单设置">
    <CardTitle>
      基础设置
    </CardTitle>
    <BlockStack gap="400">
      <Checkbox v-model="builderFormSettings.showIndex" label="显示编号" help-text="是否自动为表单元素编号并显示在标题的左侧" />
      <Checkbox v-model="builderFormSettings.boldTitle" label="粗体标题" help-text="是否将标题显示为粗体" />
      <Box>
        <CardTitle label sub="设置必填项目的标识所采用的形式">
          必填标识样式
        </CardTitle>
        <Select :options="BFIndicatorStyleOptions" v-model="builderFormSettings.requiredIndicatorStyle" />
      </Box>
      <Box v-if="builderFormSettings.showIndex">
        <CardTitle label sub="设置编号时使用的数字格式">
          编号格式
        </CardTitle>
        <InlineGrid columns="1fr auto" :gap="400">
          <Select :options="BFIndexFormatOptions" v-model="builderFormSettings.indexFormat" />
          <PopoverButton v-if="['arabic', 'roman', 'alphabet', 'hanzi'].includes(builderFormSettings.indexFormat)">
            自定义
            <template #content>
              <VerticalLayout>
                <Checkbox v-model="builderFormSettings.indexFormatConfig['lowercase']"
                  v-if="['alphabet', 'roman', 'hanzi'].includes(builderFormSettings.indexFormat)" label="小写"
                  help-text="以小写呈现指定格式" />
                <Checkbox v-model="builderFormSettings.indexFormatConfig['dotsign']" label="带点"
                  :help-text="`是否在编号后紧跟一个${builderFormSettings.indexFormat === 'hanzi' ? '顿号' : '点号'}`" />
              </VerticalLayout>
            </template>
          </PopoverButton>
        </InlineGrid>
      </Box>
    </BlockStack>
  </Dlg>
</template>