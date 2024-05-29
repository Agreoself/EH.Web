<template>
  
  <div class="main"> 
    <el-form :rules="rules" ref="form" :model="loginForm" class="loginContainer" label-position="top">
      <h1 class="loginTitle1"><img style="width: 110px; height: 40px;" src="../assets/newLogo.png"></h1>
      <div class="loginTitle">
        Sign In
      </div>
        <el-form-item prop="username" label="Username">
          <el-input type="text" v-model="loginForm.username" placeholder="eHealth network username" @change="nameChange">
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="Password">
          <el-input type="password" v-model="loginForm.password" placeholder="eHealth network password">
          </el-input>
        </el-form-item>
        <el-form-item prop="noPassword" label="Admin/HR quick login" >
          <el-switch  v-model="loginForm.noPassword" @change="psChange"/>
        </el-form-item>

        <el-button :loading="loading" type="success" style="width: 100%; margin: 10px 0px" @click="submitLogin">Sign In</el-button>
      </el-form>
  </div>
</template>

<script setup>
import storage from "@/utils/storage";

import { User } from "@/api/system/user";
const user=new User();
import { ElMessage } from "element-plus";
import store from "@/store";
import { generateDynamicRoutes, useRouter } from '@/router';
  
const router = useRouter();
const route = useRoute();
const loading=ref(false)

let rules = reactive({
  username: [{ required: true, message: "please input username", trigger: "blur" }],
  password: [{ required: true, message: "please input password", trigger: "blur" }],
});

onMounted(()=>{
  // if(loginForm.value.noPassword!=true){ 
  //   rules["password"]= [{ required: true, message: "please input password", trigger: "blur" }]
  // }
  // console.log(rules)
})

const nameChange=()=>{
  loginForm.value.password=''
}

const psChange=()=>{
 
  if(loginForm.value.noPassword!=true){ 
    rules["password"]= [{ required: true, message: "please input password", trigger: "blur" }]
  }
  else
  { 
    rules["password"]=[];
    form.value.clearValidate("password");
    // console.log(rules)
  }
}

let form = ref();
let loginForm = ref({
  username: "",
  password: "",
  noPassword: false,
});


function submitLogin() { 
  if (!form) return;
  form.value.validate((valid) => {
    if(valid){
      loading.value=true;
      if(loginForm.value.username.indexOf("@")!=-1)
      {
        loginForm.value.username=loginForm.value.username.split("@")[0];
      }
      // console.log(loginForm.value)
      user.login(loginForm.value).then((res) => {
          // console.log(res);
          if (res.code == "000") { 
            loading.value=false;
            storage.set("username", loginForm.value.username);
            storage.set("isLogin", true);
            // window.sessionStorage.clear();
            // window.sessionStorage.setItem("username", loginForm.value.username);
            // window.sessionStorage.setItem("isLogin", true);
            ElMessage.success(res.message);
            let data={userName:loginForm.value.username}
            user.getUserInfo(data).then(async (res) => {
              await store.commit("user/setUserInfo", res.result);

              // 权限菜单
              const routes = await store.dispatch("menu/generateRoutes");

              if (!routes) {
                ElMessage.error("该账号没有权限");
              } else {
                await generateDynamicRoutes(routes)
                let redirect=decodeURIComponent(route.query.redirect||'/homepage');
                // console.log(redirect)
                router.push(redirect);
              }

              // router.push('/homepage');
              await store.dispatch("enums/setAllDic");

              // state.loading = false;
              // router.push({ path: "/homepage" });
            });
          } else {
            setTimeout(() => {
              loading.value=false;
              ElMessage.error(res.message);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          loading.value=false;
          setTimeout(() => {
            ElMessage.error("登录失败");
          }, 1000);
        });
    } else {
      console.log(2);
    }
  });
}
</script>

<style scoped>
.loginContainer {
  border-radius: 5px;
  background-clip: padding-box;
  text-align: left;
  margin: auto;
  margin-top: 150px;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background:#ffffff;
  /* border: 1px solid rgb(87, 134, 235); */
  /* box-shadow: 0 0 25px #6d90f1; */
}

.loginTitle {
  margin: 0px auto 18px auto;
  text-align: center;
  font-size: 17px;
}
.loginTitle1{
  margin: 0px auto 42px auto;
  text-align: center;
  font-size: 16px;
}
 

.main {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/bg.jpg");
  background-size: cover;
  overflow: hidden;
  background-position: center;
}
</style>
