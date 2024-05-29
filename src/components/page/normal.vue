<template>
    <!-- <pageheader :pageTitle="pageTitle"/> -->

    <template v-if="hasButton">
        <Button ref="button" :buttonInfo="buttonInfo" :dynamicInfo="dynamicInfo" @CallButton="OnButton" />
    </template>

    <template v-if="hasTable">
        <el-card shadow="always" >
            <Table ref="table" :tableInfo="tableInfo" @CallTable="OnTable" />
        </el-card>
    </template>
    <!-- :style="{ height: hasButton ? (height-34-10-92) + 'px' : (height-10-92) + 'px' }" -->
    <template v-if="hasForm">
        <Form ref="form" :formInfo="formInfo" />
    </template>
</template>

<script setup>
import pageheader from '@/components/layout/pageheader.vue';
import Table from '@/components/table/index.vue'
import Button from '@/components/button/index.vue'
import Form from '@/components/form/index.vue'
const props = defineProps(['pageInfo']);
const emits = defineEmits(['CallPage']);

let table=ref();
let button=ref();
let form=ref();

const pageRenderInfo = props.pageInfo;

const pageTitle = pageRenderInfo.pageTitle;
const hasButton = pageRenderInfo.hasButton;
const hasTable = pageRenderInfo.hasTable;
const hasForm = pageRenderInfo.hasForm;

const buttonInfo = pageRenderInfo.buttonInfo;
const dynamicInfo = pageRenderInfo.dynamicInfo;
// let buttonInfo=ref({buttonInfo:pageRenderInfo.buttonInfo,dynamicInfo:pageRenderInfo.dynamicInfo})
const tableInfo = pageRenderInfo.tableInfo;
const formInfo = pageRenderInfo.formInfo;

let mainHeight = 580;//document.getElementById("mainbody").offsetHeight;
let height=document.body.offsetHeight;

onMounted(() => {

})

const OnTable = (data) => {
    tableInfo.value = data.table;

    let callbackdata = {
        components: 'table',
        componentsData: data
    };
    emits('CallPage', callbackdata);
}

const OnButton = (data) => {
    let callbackdata = {
        components: 'button',
        componentsData: data
    };
    emits('CallPage', callbackdata);
}


const Expose=(comp,method,data)=>{
    if(comp=='table'){
        table.value.Expose(method,data);
    }
    if(comp=='button'){
        button.value.Expose(method,data);
    }
    if(comp=='form'){
        button.value.Expose(method,data);
    }
}

defineExpose({
    Expose
})


</script>

<style lang="scss" scoped></style>