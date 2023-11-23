<template>
     <div class="header">
      <div class="page-header">
        <el-page-header @back="goBack" :content="props.pageTitle">
        </el-page-header>
      </div>
    </div>
</template>

<script setup>
const props =defineProps(['pageTitle']);

const goBack = () => {
  window.history.back();
}

</script>

<style lang="scss" scoped>
.header {
  /*display: flex;*/
  /*!*垂直对齐*!*/
  /*align-items: center;*/
  height: 40px;
  background-color: #EAEEED;
}

.page-header {
  float: left;
  margin-top: 10px
}

</style>