<template>
  <header>
    <div class="l-content">
      <!-- <div class="topbar__collapse" @click="collapseMenu">
        <el-icon v-if="menuCollapse"><Expand /></el-icon>
        <el-icon v-else><Fold /></el-icon> 
    </div>  -->
      <template v-if="menuCollapse">
        <el-button plain :icon="Expand" size="small" @click="collapseMenu"></el-button>
      </template>
      <template v-else>
        <el-button plain :icon="Fold" size="small" @click="collapseMenu"></el-button>
      </template>

      <BreadCrumb />
    </div>
    <div class="r-content">
      <div style="text-align: center;font-size: large;float: left;padding-right: 20px;padding-top: 12px;">
        <span>{{ store.state.user.userInfo.userName }}</span>
      </div>
      <el-dropdown trigger="click" size="small">
        <span class="el-dropdown-link">
          <img src="../../assets/user.png" class="user" />
        </span>
        <template #dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goHome">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- <Tab /> -->
  </header>
</template>

<script setup>
import store from "@/store";
import { useRouter } from '@/router';
import { logout } from "@/api/user";
import { Fold, Expand } from "@element-plus/icons-vue";
import Tab from '@/layout/header/MulitTab.vue'
import BreadCrumb from "./BreadCrumb.vue";

const userImg = ref("@/assets/logo.png");
const userInfo = store.state.user.userInfo;
const tabList = store.state.tab.tabList;

const router = useRouter();

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

const logOut = () => {
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
