const routes = {
  path: "/",
  name: "Layout",
  redirect: "/homepage",
  component: () => import("@/layout/main.vue"),
  children: [
    // {
    //   name: "homepage",
    //   path: "/homepage",
    //   component: () => import("@/views/homepage/homepage.vue"),
    //   meta: {
    //     title: "首页",
    //     show: true,
    //     keepAlive: true,
    //     icon: "desktop",
    //     type: 1,
    //   },
    // },
    // {
    //   path: "/my/info",
    //   name: "info",
    //   component: () => import("@/views/my/info.vue"),
    //   meta: {
    //     show: false,
    //     icon: "",
    //     keepAlive: true,
    //     type: 1,
    //     title: "个人中心",
    //   },
    // },
  ],
};

export default routes;
