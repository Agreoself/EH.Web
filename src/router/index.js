import { createRouter, createWebHistory } from 'vue-router';
import routes from "./module/pages";
import views from './module/views';


export const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(),
  routes: routes,
  strict: true,
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
  // console.log(store.state)
  let viewRoutes = toRaw(store.state.menu.viewRoutes);
  console.log(viewRoutes)
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
  console.log(views)
  router.addRoute(views);
  // 在动态路由添加后，在将404添加进入，解决刷新是找不到路由跳转404
  router.addRoute({
    path: '/:pathMatch(.*)',
    redirect: '/404'
  })
}
