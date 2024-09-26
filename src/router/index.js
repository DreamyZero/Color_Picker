import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from "../components/pages/MainPage.vue"
import RedactorPage from "../components/pages/RedactorPage.vue"

const routes = [
    {
        path: '/',
        name: 'main',
        component: MainPage
    },
    {
        path: '/redactor',
        name: 'redactor',
        component: RedactorPage
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
