<script setup lang="ts">
    import { Icon, InlineStack } from '@ownego/polaris-vue';
    import FormElement from '../FormElement.vue';
    import { IconStar, IconStarFilled } from '@/icons';
    import { computed, ref, type PropType } from 'vue';

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
        levels: {
            type: Number,
            default: 5
        },
        ratingMessages: {
            type: Object as PropType<string[]>,
            default: ['很差', '较差', '一般', '较好', '很好']
        }
    });

    const actualValue = ref(new Array(props.levels <= 10 && props.levels > 0 ? props.levels : 5).fill(false));
    const assumedValues = ref(new Array(props.levels <= 10 && props.levels > 0 ? props.levels : 5).fill(false));

    const getSum = (arr: boolean[]) => arr.reduce((a, b) => Number(a) + Number(b), 0);

    const value = computed(() => isAssuming.value ? getSum(assumedValues.value) : getSum(actualValue.value));

    let prevAssumedValues: boolean[] = [];
    const confirm = ref(false);
    const isAssuming = ref(false);

    function get() {
        return value.value;
    }

    defineExpose({
        get
    })

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
        return value.value === 0 ? '' : props.ratingMessages[value.value - 1];
    })
</script>

<template>
    <FormElement :title="title" :index="index" :description="description">
        <div class="rating-outer">
            <InlineStack align="center" style="width: 30%" @mouseleave="onRatingLeave()" @mouseenter="onRatingEnter()">
                <Icon @click="confirm = true" @mouseenter="onIconMouseEnter(i - 1)" draggable="false"
                    class="rating-icon" :source="assumedValues[i - 1] ? IconStarFilled : IconStar" v-for="i in 5" />
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