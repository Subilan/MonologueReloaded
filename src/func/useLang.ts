import { useI18n } from 'vue-i18n';
import zh from '@/i18n/zh_cn.json';

export default function useLang() {
	return useI18n<{ message: typeof zh }>();
}
