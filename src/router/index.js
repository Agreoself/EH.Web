import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router';
import routes from "./module/pages";
import views from './module/views'; 
import storage from "@/utils/storage";
  

// // 修改掉 VueRouter原型上的push方法, 把异常抓住, 啥也不做
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject){
//     return originalPush.call(this, location, onResolve, onReject)
//   }
//   return originalPush.call(this, location).catch(err => err)
// }
 

export const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes: routes,
  //strict: false,
})

// 挂载路由
export function loadRouter(app) {
  app.use(router);
  return router;
}

export function useRouter() {
  return router;
}

// 加载路由
export async function loadRoutes({ store }) {
  //debugger
  // console.log(store.state)
  //let viewRoutes = toRaw(store.state.menu.viewRoutes);
  let viewRoutes =  storage.get("viewRoutes")||[];
  // console.log(viewRoutes)
  if (!viewRoutes) {
    viewRoutes = await store.dispatch("menu/generateRoutes");

    generateDynamicRoutes(viewRoutes)
  } else {
    generateDynamicRoutes(viewRoutes)
  }
}

// 动态添加路由
const comps = import.meta.glob('../views/*/*');
const comps1 = import.meta.glob('../views/*/*/*');
const allComps = Object.assign({}, comps, comps1);
export function generateDynamicRoutes(list) { 
  // console.log(allComps)
  list = list.map((item) => {
    // console.log(`../${item.viewPath}`)
    // console.log(allComps[`../${item.viewPath}`])
    return {
      ...item,
      component: allComps[`../${item.viewPath}`] //() => import(`@/${item.viewPath}`)
    }
  })

  views.children = views.children.concat(list);

  let noneRoute={
    children:[],
    component: () => import('@/views/error/404.vue'),
    id:"",
    meta: {
      icon:"Error",
      keepAlive:true,
      show:true,
      title: 'Not Found',
      type:1,
    },
    name: 'none', 
    parentId:"",
    path: "/:pathMatch(.*)*",
    sort:0,
    viewPath:"views/error/404.vue" 
  }
  views.children.push(noneRoute);

  // console.log(views)
  router.addRoute(views);
  // console.log(router)
  // 在动态路由添加后，在将404添加进入，解决刷新是找不到路由跳转404
  if(!router.hasRoute('none')){
  
    router.addRoute( 
    {
        // path: '/:pathMatch(.*)',
        path: "/:pathMatch(.*)*",
        name: 'none',
        component: () => import('@/views/error/404.vue'),
        meta: {
            title: 'Not Found',
        },
        //redirect: '/404'
    })
  }
  // console.log(router.getRoutes())
}
