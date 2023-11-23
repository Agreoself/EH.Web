<template>

  <div>
    <el-row :gutter="24" style="display: flex; align-items: center;" >
    <el-col :span="1" style="margin-top:15px" >
        <template v-if="menuCollapse">
        <el-button plain :icon="Expand" size="small" @click="collapseMenu"></el-button>
      </template>
      <template v-else>
        <el-button plain :icon="Fold" size="small" @click="collapseMenu"></el-button>
      </template>
    </el-col>

      <el-col :span="17" style="margin-top:15px">  
        <!-- 面包屑 -->
        <BreadCrumb />
      </el-col>
      <!-- 全屏 -->
   
      <el-col :span="1"  style="margin-top:15px"> 
      <!-- 中英文切换 -->
        <language-bar />
      </el-col>

      <el-col :span="1" style="margin-top:15px">
        <el-button title="Refresh"  style="border: none; font-size: 20px" :icon="Refresh" circle plain @click="reload">
        </el-button>
      </el-col>

      <el-col :span="4" style="margin-top:15px">
        <!-- 用户头像 -->
        <user-bar />
      </el-col>
    </el-row>
  </div>

  
</template>

<script setup>

import store from "@/store"; 
import { Fold, Expand,Refresh } from "@element-plus/icons-vue";
import Tab from '@/layout/header/MulitTab.vue'
import BreadCrumb from "./BreadCrumb.vue";
import LanguageBar from "./LanguageBar.vue";
import UserBar from "./UserBar.vue"; 
import storage from "@/utils/storage";
import { generateDynamicRoutes, useRouter } from '@/router';
 
const router = useRouter();
const userImg = ref("@/assets/logo.png");
const userInfo = store.state.user.userInfo;
const tabList = store.state.tab.tabList;
let currentRole = storage.get("currentRole");
 
const reload = ()=>{
  location.reload()
  console.log(router)
}

let menuCollapse = computed(() => {
  return store.getters.menuCollapse;
});


const collapseMenu = () => {
  // menuCollapse.value = !menuCollapse.value;
  store.commit("menu/SET_COLLASPE", !menuCollapse.value);
};

const goHome = () => {
  router.push({ path: "/homepage" });
};

const changeRole =async (roleId) => {
  store.commit("user/setCurrentRole", roleId);
  const routes = await store.dispatch("menu/generateRoutes");
   if (!routes) {
    ElMessage.error("该账号没有权限");
  } else {
    generateDynamicRoutes(routes)
    // router.push('/homepage');
  }
  location.reload();
  // const routes = store.dispatch("menu/generateRoutes");
}

const logOut = () => {
  window.sessionStorage.setItem("isLogin", false);
  store.dispatch("user/logout").then(() => {
    router.push({
      path: "/login",
      replace: true,
    });
  });
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}

.topbar-wrap {
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #fff;
  // margin-bottom: 10px;

  .topbar__collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    cursor: pointer;

    svg {
      font-size: 24px;
    }
  }

  .topbar__flex {
    flex: 1;
  }

  .topbar__user {
    cursor: pointer;
    margin-right: 10px;

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }

    .name {
      white-space: nowrap;
      margin-right: 15px;
    }
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
}


.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #666666;
    font-weight: normal;
  }

  &:last-child {
    .el-breadcrumb__inner {
      color: #ffffff;
    }
  }
}

.r-content {
  .userName {
    font-size: large;
    padding-right: 15px;
    padding-bottom: 20px;
  }

  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #303133;
  font-weight: 700;
}
</style>
