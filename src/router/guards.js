import NProgress from 'nprogress';
import { useStore } from '@/store';
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
    router.beforeEach((to, from, next) => {
        // console.log(to)
        // console.log(from)
        if (!NProgress.isStarted()) {
            NProgress.start()
        }
    
        const hasToken =JSON.parse(window.sessionStorage.getItem('isLogin'));
        if (hasToken) {
            if (to.name == 'login') {
                next({ path: '/login' })
                NProgress.done();
            } else {
                //console.log(router.getRoutes());
              
                const hasRoute = router.hasRoute(to.name);
                if (hasRoute) {
                    const store = useStore();

                    store.dispatch('process/addProcess', {
                        keepAlive: to.meta.keepAlive,
                        label: to.meta.title,
                        value: to.fullPath,
                        name: to.name
                    })
                    next()

                } else {
                    // console.log(to.fullPath);
                    // console.log(to);
                    store.dispatch('process/resetProcess')
                    next({path:'homepage'})
                    // next({ ...to, replace: true })
                    // next({
                    //     path: to.fullPath,
                    //     query: { redirect: to.fullPath }
                    // })
                }
            }
        }
        else {
            // window.sessionStorage.setItem("isLogin", false);
            // window.sessionStorage.setItem("userName", null);
            store.dispatch("user/logout").then(() => {
                
              });
              if (!loginIgnore.includes(to)) {
                next({
                    path: "/login",
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
