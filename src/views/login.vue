<template>
  <div class="main">
    <el-form :rules="rules" ref="form" :model="loginForm" class="loginContainer">
      <h3 class="loginTitle">Sign In</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="eHealth network username">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="eHealth network password">
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width: 100%; margin: 10px 0px" @click="submitLogin(form)">Sign In</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { login, getUserInfo } from "@/api/user";
import { ElMessage } from "element-plus";
import store from "@/store";
import { generateDynamicRoutes, useRouter } from '@/router';

const router = useRouter();

let form = ref();
let loginForm = reactive({
  username: "",
  password: "",
});
let rules = {
  username: [{ required: true, message: "please input username", trigger: "blur" }],
  password: [{ required: true, message: "please input password", trigger: "blur" }],
};

function submitLogin(form) {
  if (!form) return;
  form.validate((valid) => {
    if (valid) {
      login(loginForm)
        .then((res) => {
          // console.log(res);
          if (res.code == "000") {
            let token = res.token;
            window.sessionStorage.clear();
            window.sessionStorage.setItem("username", loginForm.username);
            window.sessionStorage.setItem("isLogin", true);
            ElMessage.success(res.message);

            getUserInfo().then(async (res) => {
              await store.commit("user/setUserInfo", res.result);

              // 权限菜单
              const routes = await store.dispatch("menu/generateRoutes");

              if (!routes) {
                ElMessage.error("该账号没有权限");
              } else {
                await generateDynamicRoutes(routes)
                router.push('/');
              }

              router.push('/');
              // state.loading = false;
              // router.push({ path: "/homepage" });
            });
          } else {
            setTimeout(() => {
              ElMessage.error(res.message);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
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
  border-radius: 15px;
  background-clip: padding-box;
  text-align: left;
  margin: auto;
  margin-top: 180px;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: aliceblue;
  /* border: 1px solid rgb(87, 134, 235); */
  /* box-shadow: 0 0 25px #6d90f1; */
}

.loginTitle {
  margin: 0px auto 48px auto;
  text-align: center;
  font-size: 40px;
}

.main {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/bg.jpg");
  background-size: 100%;
  overflow: hidden;
}
</style>
