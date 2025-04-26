import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import polaris from '@ownego/polaris-vue';
import '@/assets/fonts/dm-serif-display/font.css';
import '@/assets/fonts/ibm-plex-sans/font.css';
import '@/assets/fonts/playwrite-ro/font.css';
import '@/assets/styles/global.scss';
import '@ownego/polaris-vue/dist/style.css';

import LocaleZh from '@/i18n/zh_cn.json';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    locale: 'zh',
    messages: {
        zh: LocaleZh
    }
});

const app = createApp(App)

app.use(router);
app.use(polaris);
app.use(i18n);

app.mount('#app')
