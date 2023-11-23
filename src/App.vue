<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import { useStore } from "vuex";
// import enLocale from 'element-plus/lib/locale/lang/en';
// import zhLocale from 'element-plus/dist/locale/zh-cn.mjs';

import enLocale from 'element-plus/dist/locale/en.mjs';
import zhLocale from 'element-plus/dist/locale/zh-cn.mjs';

let locale=ref();

const store = useStore()
const state = reactive({
  locale: zhLocale
});
// console.log(store.getters)
const lang = computed(() => store.getters.language);

watchEffect(() => {
  if (lang.value == "en") {
    state.locale = enLocale
  } else {
    state.locale = zhLocale
  }
})
</script>

<style lang="scss">
#app {
  height: 100vh;
}
</style>
