import NProgress from 'nprogress';
import { useStore } from '@/store';
import storage from "@/utils/storage";

const store=useStore();

NProgress.configure({ showSpinner: false });

const loginIgnore = {
    // names: ['404', '401'],      //根据路由名称匹配
    paths: ['/login'],   //根据路由fullPath匹配
    // 判断路由是否包含在该配置中
    includes(route) {
        //this.names.includes(route.name) || 
        return  this.paths.includes(route.path)
    }
}

// 加载路由守卫
export function loadGuards(router) {
    const store = useStore();
    router.beforeEach(async (to, from, next) => {
        // console.log(to) 
        if (!NProgress.isStarted()) {  NProgress.start(); }
        const hasToken = JSON.parse(storage.get('isLogin'));
        if (hasToken) 
        {
            //debugger
            if (to.name == 'Login'||to.path=='/') {
                store.dispatch("user/logout").then(() => { }); 
                next({ path: '/login', query: { redirect: '/homepage' } })
                NProgress.done();
            }
            else {
                // debugger
                // const routes=router.getRoutes();
                // let existRoute= routes.filter(i=>i.path==to.path);
                const hasRoute = router.hasRoute(to.name);// existRoute.length>0;
                if (hasRoute) { 
                    await store.dispatch('process/addProcess', {
                        keepAlive: to.meta.keepAlive,
                        label: to.meta.title,
                        value: to.fullPath,
                        name: to.name
                    })
                    next();

                } else {
                    // console.log(to.fullPath);
                    // console.log(to);
                    await store.dispatch('process/resetProcess')
                    next({ path: 'homepage' })
                }
            }
        }
        else 
        {
            // store.dispatch("user/logout").then(() => { }); 
            if (!loginIgnore.includes(to)) {
                // console.log(to)
                next({
                    path: "/login",
                    query: { redirect: to.fullPath == '/' ? "/homepage" : to.fullPath },
                    replace: true
                });
                NProgress.done();
            } else {
                next()
            } 
        }
    })

    router.afterEach(() => {
        NProgress.done()
    })
}
