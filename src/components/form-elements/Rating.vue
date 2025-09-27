<script setup lang="ts">
import { Icon, InlineStack } from '@ownego/polaris-vue';
import FormElement from './FormElement.vue';
import { IconStar, IconStarFilled } from '@/icons';
import { computed, ref, watch, type PropType } from 'vue';
import type { FormEl, SimpleResult } from '@/models/form/Form';
import Nzh from 'nzh';

const props = defineProps({
    self: {
        type: Object as PropType<FormEl<'rating'>>,
        required: true
    }
});

function getSum(arr: boolean[]) {
    return arr.reduce((a, b) => Number(a) + Number(b), 0);
}

function normalizeLevel(level: number) {
    return level <= 10 && level > 0 ? level : 5;
}

const actualValue = ref(new Array(normalizeLevel(props.self.config.levels)).fill(false));
const assumedValues = ref(new Array(normalizeLevel(props.self.config.levels)).fill(false));

watch(() => props.self.config.levels, v => {
    assumedValues.value = actualValue.value = new Array(normalizeLevel(v)).fill(false);
})

const value = computed(() => isAssuming.value ? getSum(assumedValues.value) : getSum(actualValue.value));

let prevAssumedValues: boolean[] = [];
const confirm = ref(false);
const isAssuming = ref(false);

function onIconMouseEnter(i: number) {
    for (let j = 0; j < assumedValues.value.length; j++) {
        assumedValues.value[j] = j <= i;
    }
}

function onRatingEnter() {
    prevAssumedValues = [];
    for (let v of assumedValues.value) prevAssumedValues.push(v);
    isAssuming.value = true;
}

function onRatingLeave() {
    if (!confirm.value)
        for (let j = 0; j < prevAssumedValues.length; j++)
            assumedValues.value[j] = prevAssumedValues[j];
    else {
        actualValue.value = assumedValues.value;
        confirm.value = false;
    }

    isAssuming.value = false;
}

const ratingMessage = computed(() => {
    if (value.value === 0) return '';

    if (props.self.config.ratingMessageTemplate) {
        // 基础支持$i和$h两种占位符
        return props.self.config.ratingMessageTemplate
            .replace(/\$i/g, value.value.toString())
            .replace(/\$h/g, Nzh.cn.encodeS(value.value))
    } else return props.self.config.ratingMessages[value.value - 1];
})

function get(): SimpleResult<number> {
    return {
        value: value.value,
        valid: value.value > 0
    };
}

defineExpose({
    get
});
</script>

<template>
    <FormElement>
        <div class="rating-outer">
            <InlineStack align="center" style="width: 30%" @mouseleave="onRatingLeave()" @mouseenter="onRatingEnter()">
                <Icon @click="confirm = true" @mouseenter="onIconMouseEnter(i - 1)" draggable="false"
                    class="rating-icon" :source="assumedValues[i - 1] ? IconStarFilled : IconStar"
                    v-for="i in props.self.config.levels" />
            </InlineStack>
            <Box padding-block-start="400">
                <Text as="p" variant="bodyLg">
                    {{ ratingMessage }}
                </Text>
            </Box>
        </div>
    </FormElement>
</template>

<style lang="scss" scoped>
.rating-outer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.rating-icon {
    width: 35px;
    height: 35px;
    transition: all .2s ease;
    cursor: pointer;

    &:hover {
        transform: scale(1.2);
    }
}
</style>