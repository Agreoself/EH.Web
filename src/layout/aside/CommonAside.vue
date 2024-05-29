<template>
  <!--collapse 是否水平折叠收起菜单-->
  <el-menu :collapse="isCollapse" :default-active="$route.path" class="el-menu-vertical-demo" background-color="#2f4158"
    text-color="#fff" active-text-color="#2b9dfc" :unique-opened="true">
    <!--是否水平折叠收起菜单 会影响这里字段的显示 -->
    <h3 v-show="isCollapse">System</h3>
    <h3 v-show="!isCollapse">Management System</h3>

    <template v-for="(menu, index) in menulist">

      <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.id" :key="menu.routePath">
        <template #title>
          <!-- <i :class="`el-icon-${menu.icon}`"></i> -->
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ t(menu.menuName) }}</span>
        </template>
        <template v-for="(childMenu, childIndex) in menu.children">
          <el-menu-item :index="childMenu.routePath" @click="clickMenu(childMenu)">
            <el-icon>
              <component :is="childMenu.icon" />
            </el-icon>
            {{ t(childMenu.menuName) }}
          </el-menu-item>
        </template>
      </el-sub-menu>

      <el-menu-item v-else :index="menu.routePath" @click="clickMenu(menu)">
        <!-- <i :class="`el-icon-${menu.icon}`"></i> -->

        <el-icon>
          <component :is="menu.icon" />
        </el-icon>
        <span>{{t( menu.menuName) }}</span>
      </el-menu-item>
    </template>
    <!-- <TreeMenu :menu="GETMENULIST"></TreeMenu> -->
  </el-menu>
</template>

<script setup>
import store from "@/store";
import storage from "@/utils/storage";
import { Menu } from "@/api/system/menu";
const menu = new Menu();
// import TreeMenu from "./TreeMenu.vue";
import { useRouter } from '@/router';
const router = useRouter(); 
const { t, locale } = useI18n();


const activeMenu = ref('');
let menulist = ref([]);



onMounted(async () => {
  //  menulist.value=  await store.dispatch("menu/refreshMenu");

  let currentRole = storage.get("currentRole");
  let json = { roleId: currentRole };
  await menu.GetMenuByRole(json).then(data => {
    // console.log(data);
    menulist.value = data.result;
    // console.log(menulist.value)
  });
});

const noChildren = computed(() => {
  // console.log(menulist)
  return menulist.filter((item) => item.children.length == 0);
});

const hasChildren = computed(() => {
  return menulist.filter((item) => item.children.length > 0);
});

const userInfo = computed(() => store.state.user.userInfo);
const tabList = computed(() => store.state.tab.tabList);
const isCollapse = computed(() => store.getters.menuCollapse);
const GETMENULIST = computed(() => store.getters["menu/GETMENULIST"]);

const updateMenu = (item) => {
  store.commit("tab/updateMenu", item);
};
const stepNext = (item) => {
  store.commit("tab/stepNext", item);
};

const clickMenu = (item) => {

  let { routeName, routePath } = item;

  stepNext(routeName);
  updateMenu(item);
  router.push({ path: routePath });
};


</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
  border: none;

  h3 {
    padding-top: 5px;
    color: #ffffff;
    text-align: center;
    line-height: 48px;
  }
}

.el-menu-item.is-active{
  background-color: #123444 !important;
  border-radius: 5px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
</style>
