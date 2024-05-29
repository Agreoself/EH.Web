<template>
  <el-container style="height: 100%">
    <!--左侧栏-->
    <el-aside width="auto">
      <!--左侧栏控件-->
      <common-aside></common-aside>
    </el-aside>
    <!--右侧栏-->
    <el-container>
      <!--header部分-->
      <el-header>
        <!--header部分控件-->
        <common-header v-if="isRouterAlive" />
      </el-header>
      <Tab style="margin-left: 10px;" />
      <el-main id="mainbody">

        <div>
          <router-view v-slot="{ Component }">
            <keep-alive v-if="isRouterAlive">
              <component :is="Component" :key="route.name" v-if="route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="route.name" v-if="!route.meta.keepAlive" />
          </router-view>

          <!-- <router-view v-if="isRouterAlive" /> -->
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import CommonAside from "./aside/CommonAside.vue";
import CommonHeader from "./header/CommonHeader.vue";
import Tab from "./header/MulitTab.vue";

const router = useRouter();
const route = useRoute();

const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide("reload", reload);

 

</script>

<style lang="scss" scoped>
.el-header {
  background-color: #ffffff;
}

// .el-main {
//   padding-top: 0;
// }

.el-main {
  --el-main-padding: 5px 10px;
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: var(--el-main-padding);
}
 
</style>
