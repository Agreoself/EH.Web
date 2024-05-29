<template>
    <div class="userInfo">
        <el-dropdown trigger="click" style="cursor:pointer;" :hide-on-click="false">
            <div> 
                <el-avatar v-if="userInfoCache.avatar==null||userInfoCache.avatar==''" :style="bc">{{userNameLetter}}</el-avatar>
                <el-avatar v-else :src="userInfoCache.avatar" /> 
                <!-- <img style="width: 45px; height: 45px; border-radius: 40%;" :src="userInfo.avatar" alt=""> -->
            </div>
            <template #dropdown>
                <template v-for="item in menu">
                    <el-dropdown-item v-if='!item.childer' @click="item.click" :style="item.style" :icon="item.icon">{{t(item.title)}}</el-dropdown-item>
                    <el-dropdown-item v-else>
                        <el-dropdown trigger="click" :hide-on-click='false' placement="left-start" >
                         <span :style="item.style" ><el-icon :size="12"><Switch /></el-icon>{{t(item.title)}}</span> 
                          <template #dropdown> 
                            <el-dropdown-item v-for="(role, key) in userInfoCache.roleList" :disabled="role == currentRole" @click="changeRole(role)">{{ t(key) }}</el-dropdown-item>
                          </template>
                        </el-dropdown>
                    </el-dropdown-item>
                </template>
                <!-- <el-dropdown-menu>
                    <el-dropdown-item  @click="logOut" style="color: blue;">{{t('设置头像')}}</el-dropdown-item>
                    <el-dropdown-item  @click="logOut" style="color: red;">{{t('退出')}}</el-dropdown-item>src="@/assets/user.png"
                </el-dropdown-menu> -->
            </template>
        </el-dropdown>
        <!-- 其他 -->
        <el-row>
            <el-col>
                <span
                    style="color: #212121; left: 10px;top: 15px; font-size: 16px;position: relative;"
                >{{ userInfoCache.email.split("@")[0].split(".")[0]+' '+userInfoCache.email.split("@")[0].split(".")[1] }}</span>
            </el-col>
            <el-col>
                <span
                    style="color: gray; bottom: 20px; left:10px; font-size: 12px;position: relative;"
                >{{t(roleName)}}</span>
            </el-col>
        </el-row>
    </div>
    <UserChangePhoto v-if="dialogVisible" :key="dialogKey" :userInfo="userInfoCache"/>
</template>

<script setup>
import store from "@/store";  
import storage from "@/utils/storage";
import { loadGuards } from '@/router/guards';
import { generateDynamicRoutes, useRouter,loadRoutes } from '@/router';
import { useI18n } from "vue-i18n"; 
import UserChangePhoto from "./UserChangePhoto.vue";
const dialogVisible = ref(false);
const dialogKey = ref(0);

const {t}=useI18n();
const router = useRouter();
const userImg = ref("@/assets/logo.png");
const userInfo = store.state.user.userInfo; 
let userInfoCache=storage.get("userInfo")
let currentRole = storage.get("currentRole");

let roleList=userInfoCache.roleList; 
let roleName=ref("普通用户");

let userFullName=userInfoCache.email.split("@")[0].split(".")[0]+' '+userInfoCache.email.split("@")[0].split(".")[1];

let getFirstLetter=(userFullName)=>{
    let nameArr= userFullName.split(' ');
    let str="";
    nameArr.forEach(i=>{
        str+=i.charAt(0).toUpperCase()
    })
    return str;
}

let userNameLetter=ref(getFirstLetter(userFullName));
let bc={backgroundColor:'rgb(' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ',' + getRandomInt(0, 255) + ')'}
  
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 不包含最大值，包含最小值
}

onMounted(()=>{
    s(); 
})

const s=()=>{
    Object.keys(roleList).forEach(i=>{
        if(roleList[i]==currentRole)
        roleName.value=i;
    })
}

const changeRole = async (roleId) => {

    store.commit("user/setCurrentRole", roleId);
    const routes = await store.dispatch("menu/generateRoutes");
    if (!routes) {
        ElMessage.error("该账号没有权限");
    } else {
        //debugger
        // store.commit("menu/CLEAR_MENU_GROUP");
        // store.commit("menu/CLEAR_VIEW_ROUTES");
        // loadRoutes();
        await generateDynamicRoutes(routes)

        //console.log(router.getRoutes())
    }
    location.reload();
    // const routes = store.dispatch("menu/generateRoutes");
}

const changePhoto =() => {
dialogVisible.value=true;
   dialogKey.value=Math.random();
}

const logOut = () => {
//   window.sessionStorage.setItem("isLogin", false);
  store.dispatch("user/logout").then(() => {
    router.push({
      path: "/login",
      replace: true,
    });
  });
};

let titleList=[];
Object.keys(roleList).forEach(i=>{
    let obj={};
    obj["title"]=i
    obj["value"]=roleList[i];
    obj["disable"]=roleList[i] == currentRole;
    obj["click"]=changeRole;
    titleList.push(obj);
})

let menu=[
{
    title:"更换头像",
    disabled:false,
    style:"color: blue;",
    icon:"Picture",
    click:changePhoto,
},{
    title:"切换角色",
    disabled:false,
    style:"color: blue;",
    icon:"Switch",
    childer:[
    //titleList
    ]
},{
    title:"退出",
    disabled:false,
    click:logOut,
    style:"color: red;",
    icon:"Position",
}]

</script>

<style lang="scss" scoped>
.userInfo{
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
}
</style>