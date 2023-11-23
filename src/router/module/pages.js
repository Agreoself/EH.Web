const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login.vue'),
        meta: {
            title: "登录"
        }
    },
    // {
    //     path: '/401',
    //     name: '401',
    //     component: () => import('@/views/error/401.vue'),
    //     icon: '',
    //     meta: {
    //         title: '401',
    //     }
    // },
    // {
    //     path: '/404',
    //     name: '404',
    //     component: () => import('@/views/error/404.vue'),
    //     meta: {
    //         title: '404',
    //     }
    // },
    {
        path: "/:pathMatch(.*)*", // 解决路由爆[Vue Router warn]: No match found for location with path
        meta: {
            title: "找不到此页面",
        },
        // redirect: '/403', // 错误方式，刷新立马会导致进入守卫的页面
        component: () => import("@/views/error/404.vue"), // 切记不要使用 redirect: '/403',
    }

]

export default routes;