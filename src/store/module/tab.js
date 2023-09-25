//面包屑导航
export default {
    namespaced: true,
    //存储数据
    state: {
        isCollapse: false,
        //面包屑列表
        tabList: [
            {
                routePath: '/homepage',
                routeName: 'homepage',
                menuName: '首页',
                icon: 's-home',
                // url: 'homepage/index.vue',
            }
        ],
    },
    //调用方法
    mutations: {
        //更新面包屑数据
        updateMenu(state, item) {
            if (item.menuName !== 'homepage') {
                let index = state.tabList.findIndex(tabItem => tabItem.menuName === item.menuName);
                if (index === -1) {
                    state.tabList.push(item);
                }
            }
        },
        stepNext(state, item) {

        }
    },
    actions: {

    }
}
