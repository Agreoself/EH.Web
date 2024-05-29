import { deepTree, revisePath } from "@/utils";
// import { userMenu } from "@/api/user";
import { Enum } from "@/api/system/enum";
const enums=new Enum();
import storage from "@/utils/storage";

const state = () => ({
  // 字典列表
  allDic: storage.get("allDic") || [],
});

const mutations = {
  SET_ALL_DIC(state, list) {
    state.allDic = list;
    storage.set("allDic", list);
  },
   
};

const actions = {
  async setAllDic({ commit }) { 
      enums.getAllDic().then((res) => {
        if(res.code=="000"){
          // console.log(res.result) 
          commit("SET_ALL_DIC", res.result);
        }
    });
  },

};

export default {
  namespaced: true,
  state: state,
  actions: actions,
  mutations: mutations,
};
