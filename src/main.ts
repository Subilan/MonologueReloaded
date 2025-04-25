import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import polaris from '@ownego/polaris-vue';
import '@/assets/fonts/dm-serif-display/font.css';
import '@/assets/fonts/ibm-plex-sans/font.css';
import '@/assets/fonts/playwrite-ro/font.css';
import '@/assets/styles/global.scss';
import '@ownego/polaris-vue/dist/style.css';

const app = createApp(App)

app.use(router);
app.use(polaris)

app.mount('#app')
