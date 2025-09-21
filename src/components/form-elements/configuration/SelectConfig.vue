    <template>
        <Config v-model="selectConfig">
            <TextField auto-complete="off" v-model="selectConfig.config.helperText" label="帮助文本" placeholder="键入帮助文本" />
            <FullButton @click="modalSelectOptionConfig = true">编辑选项</FullButton>
        </Config>

        <Dlg v-model="modalSelectOptionConfig" title="编辑选项">
            <BlockStack gap="400">
                <VueDraggable v-if="selectConfig.config.options.length" v-model="selectConfig.config.options"
                    :animation="150" class="vertical-list" ghost-class="phantom" handle=".drag-handle">
                    <InlineGrid columns="1fr auto" gap="400" v-for="option, i in selectConfig.config.options"
                        :key="selectConfig.config.options[i].id">
                        <TextField auto-complete="off" v-model="selectConfig.config.options[i].label"
                            placeholder="选项内容" />
                        <BlockStack gap="200">
                            <Button @click="remove(option.id)" variant="tertiary" :icon="Close" />
                            <DragHandle />
                        </BlockStack>
                    </InlineGrid>
                </VueDraggable>
                <em v-else>暂无选项，请先添加</em>
                <FullButton @click="addOption">添加选项</FullButton>
            </BlockStack>
        </Dlg>
    </template>

<script lang="ts" setup>
    import type { FormElement } from '@/models/form/Form';
    import Config from './Config.vue';
    import { BlockStack, TextField } from '@ownego/polaris-vue';
    import Dlg from '@/components/ui/Dlg.vue';
    import { ref } from 'vue';
    import FullButton from '@/components/ui/FullButton.vue';
    import { VueDraggable } from 'vue-draggable-plus';
    import DragHandle from '@/components/ui/DragHandle.vue';
    import { Close } from '@/icons';
    import { v4 } from 'uuid';

    const selectConfig = defineModel<FormElement<'select'>>({ required: true });

    const modalSelectOptionConfig = ref(false);

    function addOption() {
        selectConfig.value.config.options.push({
            label: '',
            id: v4()
        })
    }

    function remove(id: string) {
        selectConfig.value = {
            ...selectConfig.value, config: {
                ...selectConfig.value.config, options: selectConfig.value.config.options.filter(x => x.id !== id)
            }
        }
    }
</script>