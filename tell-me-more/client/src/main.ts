import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Home from './Views/Home.vue'
import PodcastPlayer from './Views/PodcastPlayer.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-green/theme.css';
import 'primeicons/primeicons.css';
import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)

app.use(PrimeVue, {
    unstyled: false
});

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/podcast/:feedId', component: PodcastPlayer }
    ]
})
app.use(router)

app.mount('#app')
