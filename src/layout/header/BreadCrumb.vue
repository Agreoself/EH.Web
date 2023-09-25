<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in navigateList" :key="index" :to="item.path">
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>

  <!-- <el-breadcrumb separator="=>"> 
    <el-breadcrumb-item v-for="(item, index) in navigateList" :to="{ path: item.path }"
      :key="index">{{ item.title }}</el-breadcrumb-item>
  </el-breadcrumb> -->
</template>
  
<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const { currentRoute } = useRouter();

const navigateList = ref([]);

const menuGroup = computed(() => {
  return store.getters.menuGroup;
});

watch(() => currentRoute.value,(route) => {
    if (route.path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  },
  {
    immediate: true,
  }
);

// watch(router, (value) => {
//   console.log(value)
//   if (value.path === '/main') {
//     navigateList.value = []
//     return
//   }
//   const updatedNavigateList = value.matched.map(item => {
//     return { path: item.path, title: item.name }
//   })
//   navigateList.value = updatedNavigateList
//   //   console.log(navigateList.value)
// })

function getBreadcrumb() {
  const matched = currentRoute.value.matched.filter(
    (item) => item.meta && item.meta.title
  );
  navigateList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.show !== false
  );
}

</script>
  
<style lang="scss" scoped></style>