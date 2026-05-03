import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true }
    },
    {
        path: '/subjects',
        name: 'subjects',
        component: () => import('../views/CategoryView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/login/LoginView.vue'),
        meta: { transition: 'slide', hideLayout: true, guestOnly: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/auth/register/RegisterView.vue'),
        meta: { transition: 'slide', hideLayout: true, guestOnly: true }
    },
    {
        path: '/email-confirmation',
        name: 'email-confirmation',
        component: () => import('../views/auth/email-confirmation/EmailConfirmationView.vue'),
        meta: { transition: 'slide', hideLayout: true, guestOnly: true }
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('../views/auth/reset-password/ResetPasswordView.vue'),
        meta: { transition: 'slide', hideLayout: true, guestOnly: true }
    },
    {
        path: '/posts/:id',
        name: 'post-detail',
        component: () => import('../views/PostDetailView.vue'),
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/landing',
        name: 'landing-page',
        component: () => import('../views/LandingPageView.vue'),
        meta: { hideLayout: true }
    },
    {
        path: '/users/me',
        name: 'user-profile',
        component: () => import('../views/userProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/my-posts',
        name: 'my-posts',
        component: () => import('../views/MyPostsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/discord/linked',
        name: 'discord-linked',
        component: () => import('../views/discord/DiscordLinkedView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/discord/error',
        name: 'discord-error',
        component: () => import('../views/discord/DiscordErrorView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/:catchAll(.*)*',
        name: 'not-found',
        component: () => import('../views/404View.vue'),
        meta: { hideLayout: true }
    }
]



const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, _from, savedPosition) {
        // Ak používateľ ide späť/vpred pomocou tlačidiel prehliadača, vráť sa na uloženú pozíciu
        if (savedPosition) {
            return savedPosition
        }
        // Pri anchore (#) scrolluj na daný element
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth'
            }
        }
        // Inak vždy scrolluj na vrch stránky
        return {
            top: 0,
            left: 0,
            behavior: 'smooth'
        }
    }
})

// Global navigation guard
router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = authStore.isAuthenticated

    // Check if route requires auth
    if (to.meta.requiresAuth && !isAuthenticated) {
        // Redirect to login if not authenticated
        next({ name: 'login', query: { redirect: to.fullPath } })
        return
    }
    // Check if route is for guests only (login, register)
    if (to.meta.guestOnly && isAuthenticated) {
        // Redirect to home if already authenticated
        next({ name: 'home' })
        return
    }
    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        // Redirect to home if not admin
        next({ name: 'home' })
        return
    }
    // Proceed as normal
    next()
})

// Navigation guard pre zachytenie chýb pri načítavaní komponentov
router.onError((error) => {
    console.error('Router error:', error)
    // Presmerovať na 404 pri chybe načítania komponentu
    if (error.message.includes('Failed to fetch dynamically imported module')) {
        router.push({ name: 'not-found' })
    }
})

export default router