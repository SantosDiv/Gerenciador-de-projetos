import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { icons } from './utils/icons'
import router from './routes'

addIcons(...icons);

const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.use(router);
app.mount('#app');
