import { createRouter, createWebHashHistory } from "vue-router"
import admin from "./components/admin.vue"
import add from "./components/add.vue"
import tovar from "./components/tovar.vue"
import pagenone from "./components/pagenone.vue"
import tovaredit from "./components/tovaredit.vue"
import tovarshow from "./components/tovarshow.vue"
import glavnaya from "./components/glavnaya.vue"
import reg from "./components/reg.vue"
import log from "./components/log.vue"
import lichkab from "./components/lichkab.vue"
import lichkabshow from "./components/lichkabedit.vue"
import lichkabedit from "./components/lichkabedit.vue"
import cart from "./components/cart.vue"
import catalog from "./components/catalog.vue"
import orders from "./components/orders.vue"
const routes = [
    { path: '/orders', component: orders, name: 'orders', meta: { requiresAuth: true }},
    { path: '/catalog', component: catalog, name: 'catalog' },
    { path: '/cart', component: cart, name: 'cart', meta: { requiresAuth: true } },
    {
        path: '/lichkab', 
        component: lichkab, 
        meta: { requiresAuth: true }, 
        name: 'lichkab', 
        children: [
            { path: 'edit', component: lichkabedit, name: 'lichkab-edit' },
            { path: 'show', component: lichkabshow, name: 'lichkab-show' },
            { path: '', redirect: 'show' }
        ]
    },
    { path: '/log', component: log, name: 'log', meta: { guest: true } },
    { path: '/reg', component: reg, name: 'reg', meta: { guest: true } },
    { path: '/admin', component: admin, meta: { requiresAuth: true, requiresAdmin: true }, name: 'admin' },
    { path: '/add', component: add, meta: { requiresAuth: true, requiresAdmin: true }, name: 'add' },
    { path: '/tovar/:id([0-9]*)', component: tovar, name: 'tovar', children: [
            { path: 'edit', component: tovaredit, meta: { requiresAuth: true, requiresAdmin: true }, name: 'tovar-edit'},
            { path: 'show', component: tovarshow, name: 'tovar-show' },
            { path: '', redirect: 'show' }
        ]
    },
    { path: '/', component: glavnaya, name: 'glavnaya' },
    { path: '/:pathName(.*)', component: pagenone, name: 'pagenone' }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
import useUsers from "./composables/useUsers"

router.beforeEach((to, from, next) => {
    const { currentUser, isAdmin } = useUsers()
    const isAuthenticated = !!currentUser.value
    const userIsAdmin = isAdmin()
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'log' })
        return
    }
    if (to.meta.requiresAdmin && !userIsAdmin) {
        next({ name: 'pagenone' })
        return
    }
    if (to.meta.guest && isAuthenticated) {
        next({ name: 'lichkab' })
        return
    }
    next()
})