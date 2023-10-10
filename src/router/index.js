import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/orders-list',
        name: 'OrdersList',
        component: () => import('@/views/OrdersList.vue'),
    },
    {
        path: '/orders-content',
        name: 'OrdersContent',
        component: () => import('@/views/OrdersContent.vue'),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
