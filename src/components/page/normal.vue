<template>
    <pageheader :pageTitle="pageTitle"/>

    <template v-if="hasButton">
        <Button :buttonInfo="buttonInfo" />
    </template>
  
    <template v-if="hasTable">
        <el-card shadow="always" >
        <Table  :tableInfo="tableInfo" @CallTable="OnTable" />
        </el-card>
    </template>

    <template v-if="hasForm">
        <Form :formInfo="formInfo"/>
    </template>
</template>

<script setup>
import pageheader from '@/components/layout/pageheader.vue';
import Table from '@/components/table/index.vue'
import Button from '@/components/button/index.vue'
import Form from '@/components/form/index.vue'
const props=defineProps(['pageInfo']);
const emits=defineEmits(['CallPage']);

const pageRenderInfo=props.pageInfo;


const pageTitle=pageRenderInfo.pageTitle;
const hasButton=pageRenderInfo.hasButton;
const hasTable=pageRenderInfo.hasTable; 
const hasForm=pageRenderInfo.hasForm;

const buttonInfo=pageRenderInfo.buttonInfo;
const tableInfo=pageRenderInfo.tableInfo;
const formInfo=pageRenderInfo.formInfo;
 
 
onMounted(()=>{
    // console.log(pageRenderInfo)
})

const OnTable = (data) => { 
  tableInfo.value = data.table;

  let callbackdata={
    components:'table',
    componentsData:data
  };
  emits('CallPage',callbackdata); 
}

 

</script>

<style lang="scss" scoped></style>