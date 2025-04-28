<script setup lang="ts">
    import { TextField } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import { computed, ref } from 'vue';
    import type { ParagraphInputResult } from '@/models/form/ParagraphInput';
    import { compileTemplateConfiguration, extractTemplateConfiguration } from '@/func/form/paragraph-input';

    const props = defineProps({
        title: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        template: {
            type: String,
            required: true
        }
    });


    const templateSplitted = props.template.split(/\[.*?\]/);
    const templateConfigurations = compileTemplateConfiguration(extractTemplateConfiguration(props.template));

    console.log(templateConfigurations)

    const fieldCount = templateSplitted.length - 1;

    const models = ref(new Array(fieldCount).fill(''));
    const errors = ref(new Array(fieldCount).fill(false));
    const resContent = computed(() => {
        let res = '';
        for (let i = 0; i < templateSplitted.length - 1; i++) {
            res += templateSplitted[i];
            res += models.value[i] || '';
        }
        res += templateSplitted[templateSplitted.length - 1];
        return res;
    })

    function get(): ParagraphInputResult {
        return {
            content: resContent.value,
            values: models.value,
            valid: new Array(fieldCount).fill(0).map((_, i) => doCheck(null, i)).every(x => x)
        };
    }

    defineExpose({
        get
    })

    function doCheck(e: any, i: number) {
        const value = models.value[i];

        if (Object.keys(templateConfigurations[i]).length === 0) return true;

        if (templateConfigurations[i].required && value.trim().length === 0) {
            errors.value[i] = true;
            return false;
        }

        if (templateConfigurations[i].type === 'number') {
            const number = Number(value);

            if (
                isNaN(number)
                || (templateConfigurations[i].min !== '' && number < templateConfigurations[i].min)
                || (templateConfigurations[i].max !== '' && number > templateConfigurations[i].max)
            ) {
                errors.value[i] = true;
                return false;
            }
        }

        if (templateConfigurations[i].type === 'text') {
            if (
                (templateConfigurations[i].minLength && value.length < templateConfigurations[i].minLength)
                || (templateConfigurations[i].maxLength && value.length > templateConfigurations[i].maxLength)
            ) {
                errors.value[i] = true;
                return false;
            }
        }

        errors.value[i] = false;
        return true;
    }
    
</script>

<template>
    <FormElement :title="title" :index="index" :description="description">
        <div class="paragraph-container">
            <template v-for="(segment, i) in templateSplitted">
                <Text variant="bodyLg">{{ segment }}</Text>
                <TextField @input="e => doCheck(e, i)" @change="e => doCheck(e, i)" v-model="models[i]"
                    :max-length="templateConfigurations[i]['maxLength']" :error="errors[i]"
                    :min-length="templateConfigurations[i]['minLength']" :min="templateConfigurations[i]['min']"
                    :max="templateConfigurations[i]['max']" :type="templateConfigurations[i]['type']" size="slim"
                    auto-size class="paragraph-textfield" auto-complete="off" v-if="i < templateSplitted.length - 1 && templateConfigurations[i]['type'] !== 'select'" />
            </template>
        </div>
    </FormElement>
</template>

<style lang="scss">
.paragraph-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.paragraph-textfield input {
    min-width: 100px;
}
</style>