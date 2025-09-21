import type { TextInputTypeRegexPreset } from '@/models/form/elements/TextInput';

export const TextfieldRegexPreset: Record<TextInputTypeRegexPreset, RegExp> = {
	number: /^-?\d+(\.\d+)?$/, 
	url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, 
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
	tel: /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)(?:\W*\d){1,14}$/, 
	time: /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 
	integer: /^[+-]?\d+$/,
	currency: /^((?:AED|AFN|ALL|AMD|ANG|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTN|BWP|BYR|BZD|CAD|CDF|CHF|CLP|CNY|COP|CRC|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HRK|HTG|HUF|IDR|ILS|INR|IQD|IRR|ISK|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LTL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRO|MUR|MWK|MXN|MYR|MZN|NAD|NGN|NIO|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SBD|SCR|SDG|SEK|SGD|SHP|SLL|SOS|SRD|SSP|STD|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|UYU|UZS|VEF|VND|VUV|WST|XAF|XCD|XOF|XPF|YER|ZAR|ZMW)|(?:원|RMB|руб|руб\.|Lt|ر\.ق\.‏|р\.|د\.ب\.‏|TSh|din\.|Rp|ر|WS\$|Rs|T\$|S\/\.|SR|Bs\.|NOK|CF|Fdj|£|¤|¥|SEK|Br|Bs|MTn|د\.أ\.‏|ден|den|RUB|أ\.م\.‏|лв\.|नेरू|DA|zł|Nfk|дин|дин\.|din|din\.|ر\.ي\.‏|US\$|Ksh|د\.ت\.‏|CFA|DT|MAD|B\/\.|NT\$|FCFA|soʻm|UM|Db|CVE|man\.|EC\$|PLN|රු\.|ر\.س\.‏|ج\.م\.‏|ر\.ع\.‏|￥|CA\$|ALL|Kč|د\.إ\.‏|դր\.|៛|د\.ك\.‏|ل\.ل\.‏|Afl\.|сом|LEI|kn|kr|kr\.|KM|Ft\.|VT|FC|ف\.ج\.ق\.‏|Fr\.|SFr\.|FCFP|m\.|ریال|FG|ج\.س\.|د\.ج\.‏|КМ|R\$|Lekë|৳|د\.ل\.‏|ل\.س\.‏|Nu\.|ман\.|₡|฿|₦|₩|ብር|₪|₫|€|₭|₮|₱|\$|S\$|₲|GEL|TRY|₴|₸|₹|₺|₽|Kz|LS|RF|MOP\$|GH₵|D|E|د\.ع\.‏|FBu|G|د\.م\.‏|Ft|K|RM|L|USh|P|Q|Le|R|S|Rs\.|NAf\.|DKK|؋|Ar|C\$|MK))[ ]?((?:[0-9]{1,3}[ \.,]?)*[ \.,]?[0-9]+)$/ 
};

export const TextfieldRegexPresetFailMessage: Record<TextInputTypeRegexPreset, string> = {
	number: '不是数字',
	url: '网址格式不正确',
	email: '电子邮箱格式不正确',
	tel: '手机格式不正确',
	time: '时间格式不正确',
	integer: '不是整数',
	currency: '货币格式不正确'
}