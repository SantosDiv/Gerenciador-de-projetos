import { createApp } from 'vue'
import App from './App.vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { icons } from './utils/icons'
import router from './routes'
import Toast from 'vue-toastification';
import './style.css';
import 'vue-toastification/dist/index.css';

addIcons(...icons);

dayjs.locale('pt-br');

const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.use(router);
app.use(Toast, {
  position: 'top-right',
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
});

app.mount('#app');
