<script setup lang="ts">
  import CardSectionTitle from '@/components/CardSectionTitle.vue';
  import CardTitle from '@/components/CardTitle.vue';
  import FormElementShortcut from '@/components/FormElementShortcut.vue';
  import FormElementShortcutContainer from '@/components/FormElementShortcutContainer.vue';
  import { IconDropdown, IconMultipleChoice, IconTextInput, IconSingleChoice, IconParagraphInput, IconTextInputMultiple, IconSlider, IconStar } from '@/icons';
  import type { FormElements, FormElementType } from '@/models/form/Form';
  import router from '@/router';
  import { BlockStack, Card, Icon, InlineGrid, Layout, LayoutSection, Page } from '@ownego/polaris-vue';
  import Choice from '@/components/form-elements/Choice.vue';
  import Select from '@/components/form-elements/Select.vue';
  import Rating from '@/components/form-elements/Rating.vue';
  import Slider from '@/components/form-elements/Slider.vue';
  import TextInput from '@/components/form-elements/TextInput.vue';
  import ParagraphInput from '@/components/form-elements/ParagraphInput.vue';
  import { useEventBus } from '@vueuse/core';
  import makeId from '@/func/makeId';
  import { reactive, ref, useTemplateRef } from 'vue';
  import moveEl from '@/func/moveEl';

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


  const formElements = reactive<FormElements.Object[]>([
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
  ]);

  const isCandidate = reactive<{ [prop: string]: boolean }>({});
  const isFirstCandidate = ref(false);

  function resetCandidates(keys: string[] = []) {
    for (let key of keys.length > 0 ? keys : Object.keys(isCandidate)) isCandidate[key] = false;
    isFirstCandidate.value = false;
  }

  formElements.forEach(v => {
    v.identifier = makeId(10);
  });

  resetCandidates(formElements.map(x => x.identifier || ''));

  const formObjectRefs = useTemplateRef('formObjects');

  const bus = useEventBus<string>('draggable');

  const targetIndexes = reactive({
    from: -1,
    to: -1
  });

  const targetDirection = ref('');

  function resetTargetIndexes() {
    targetIndexes.from = -1;
    targetIndexes.to = -1;
  }

  bus.on((event) => {
    if (event != 'dragstop') return;

    if (targetIndexes.from === -1 || targetIndexes.to === -1) return;

    moveEl(formElements, targetIndexes.from, targetIndexes.to);

    resetTargetIndexes();
    resetCandidates();
  })

  bus.on((event, args: {
    left: number,
    right: number,
    top: number,
    bottom: number,
    identifier: string,
    direction: 'up' | 'down'
  }) => {
    if (event !== 'drag') return;

    if (!formObjectRefs.value) return;

    const res = formObjectRefs.value.map(x => {
      if (!x?.$el) return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        identifier: ''
      }

      const rect = x.$el.nextSibling.getBoundingClientRect();

      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        identifier: x.$props.config.identifier
      }
    })
      .filter(formObject => {
        return !(args.right < formObject.left ||
          args.left > formObject.right ||
          args.bottom < formObject.top ||
          args.top > formObject.bottom) && formObject.identifier !== args.identifier
      })

    if (res.length === 0) {
      resetCandidates();
      resetTargetIndexes();
    }

    const tg = res[args.direction === 'up' ? 0 : res.length - 1];

    if (!tg) return;

    if (!tg.identifier) return;

    targetIndexes.from = formElements.findIndex(x => x.identifier === args.identifier);
    targetIndexes.to = formElements.findIndex(x => x.identifier === tg.identifier);

    targetDirection.value = targetIndexes.to > targetIndexes.from ? 'down' : 'up';

    if (targetIndexes.to === 0) {
      isFirstCandidate.value = true;
      for (let key of Object.keys(isCandidate)) {
        isCandidate[key] = false;
      }
    } else {
      isFirstCandidate.value = false;
      for (let key of Object.keys(isCandidate)) {
        isCandidate[key] = targetIndexes.to > targetIndexes.from ? key === tg.identifier : key === formElements[Math.max(0, targetIndexes.to - 1)].identifier;
      }
    }
  });

  async function save() {

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
          <BlockStack gap="0" class="form-elements">
            <hr style="border-width: 2px;" class="form-element-hr" v-if="isFirstCandidate" />
            <!-- @vue-ignore -->
            <component v-for="(obj, i) in formElements" :classNames="isCandidate[obj.identifier] ? 'is-candidate' : ''"
              ref="formObjects" :is="getComponent(obj.type)" :config="obj" :index="i + 1"
              :title="obj.title || 'default title'" :description="obj.description" :identifier="obj.identifier" />
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

<style lang="scss">
.form-element-hr {
  border-width: 0;
  border-color: blue;
  border-style: solid;
  border-radius: 100px;
  margin: 8px 0;
}

.is-candidate {
  +hr {
    border-width: 2px;
  }
}
</style>