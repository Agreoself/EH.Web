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
        <common-header />
      </el-header>
      <Tab style="margin-left: 10px;"/>
      <el-main id="mainbody">
       
        <div>
          <!--左侧栏 和 header部分对于整个后台部分都是不变的，唯一变的就是上面3的部分，这里就通过router-view来展示所需控件-->
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import CommonAside from "./aside/CommonAside.vue";
import CommonHeader from "./header/CommonHeader.vue";
import Tab from "./header/MulitTab.vue";
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
