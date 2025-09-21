import type BuilderFormSettings from '@/static/BuilderFormSettings';
import { BuilderFormSettingsDefault } from '@/static/BuilderFormSettings';
import { reactive } from 'vue';

const settings = reactive<BuilderFormSettings>(BuilderFormSettingsDefault);

export default function () {
	return settings;
}
