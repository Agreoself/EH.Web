import storage from "@/utils/storage";

export default {
    namespaced: true,
    //存储数据
    state: {
       userInfo: {}
    },
    //调用方法
    mutations: {
        setUserInfo(state,userInfo){
            storage.set("userInfo", userInfo);
            state.userInfo = userInfo;
        },
        CLEAR_USER(state) {
            state.userInfo = {};
            storage.remove("userInfo");
          },
    },
    actions: {
        logout({ commit }) {
            commit("CLEAR_USER"); 
            commit("menu/CLEAR_MENU_GROUP", null, { root: true });
            commit("menu/CLEAR_VIEW_ROUTES", null, { root: true });
            commit("process/RESET_PROCESS", null, { root: true });
          }
    }
}
