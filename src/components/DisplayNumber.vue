<template>
    <span class="number" :class="`format-${config.format}`">{{ resultValue }}</span>
</template>

<script lang="ts" setup>
import Nzh from 'nzh';
import { computed, type PropType } from 'vue';

const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    config: {
        type: Object as PropType<NumberComponentConfiguration>,
        default: {
            format: 'arabic'
        } as NumberComponentConfiguration
    }
})

const resultValue = computed(() => {
    let val = props.value;
    let valStr = '';

    switch (props.config.format) {
        case 'arabic': {
            valStr = val.toString();
            break;
        }
        case 'roman': {
            valStr = convertToRoman(val);

            if (props.config.configuration.lowercase) {
                valStr = valStr.toLowerCase();
            }

            break;
        }
        case 'hanzi': {
            valStr = props.config.configuration.lowercase ? Nzh.cn.encodeS(val) : Nzh.cn.encodeB(val);

            break;
        }
        case 'alphabet': {
            valStr = convertToAlphabet(val);

            if (props.config.configuration.lowercase) {
                valStr = valStr.toLowerCase();
            }

            break;
        }
    }

    if (props.config.configuration.dotsign === true) {
        if (props.config.format !== 'hanzi') {
            valStr += '.'
        } else {
            valStr += '、'
        }
    }

    return valStr;
})

function convertToRoman(num: number) {
    const RomanMap: Record<string, number> = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    let str = '';

    for (let i of Object.keys(RomanMap)) {
        let q = Math.floor(num / RomanMap[i]);
        num -= q * RomanMap[i];
        str += i.repeat(q);
    }

    return str;
}

function convertToAlphabet(num: number) {
    const alphabet = [
        'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z'
    ];

    return alphabet[(num - 1) % 26];
}
</script>

<script lang="ts">
export const NumberFormats = ['roman', 'arabic', 'hanzi', 'alphabet'] as const;
export type NumberFormat = (typeof NumberFormats)[number];

export interface NumberComponentConfiguration {
    format: NumberFormat,
    configuration: Partial<{
        lowercase: boolean,
        dotsign: boolean
    }>
}
</script>