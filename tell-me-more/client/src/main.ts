import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-green/theme.css';
import 'primeicons/primeicons.css';
//import './output.css';


const app = createApp(App)
app.use(PrimeVue, {
    unstyled: false
});
app.mount('#app')
