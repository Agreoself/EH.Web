<template>
    <div class="userInfo">
        <el-dropdown trigger="click" style="cursor:pointer;">
            <div>
                <img  style="width: 40px; height: 40px; border-radius: 40%;" src="@/assets/user.png" alt="">
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="(role, key) in store.state.user.userInfo.roleList" :disabled="role == currentRole"
              @click="changeRole(role)">{{ key }}</el-dropdown-item>
                    <el-dropdown-item @click="logOut">退出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <!-- 其他 -->
        <el-row>
            <el-col>
                <span
                    style="color: #212121; left: 10px;top: 15px; font-size: 16px;position: relative;"
                >{{ userInfo.userName }}</span>
            </el-col>
            <el-col>
                <span
                    style="color: gray; bottom: 20px; left:10px; font-size: 12px;position: relative;"
                >{{ roleName }}</span>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import store from "@/store";  
import storage from "@/utils/storage";
import { generateDynamicRoutes, useRouter } from '@/router';

const router = useRouter();
const userImg = ref("@/assets/logo.png");
const userInfo = store.state.user.userInfo;
const tabList = store.state.tab.tabList;
let currentRole = storage.get("currentRole");

let roleList=store.state.user.userInfo.roleList;
let roleName=ref("");

onMounted(()=>{
    s();
    // console.log(roleName)
})

const s=()=>{
    Object.keys(roleList).forEach(i=>{
        if(roleList[i]==currentRole)
        roleName.value=i;
    })
}

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
.userInfo{
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}
</style>