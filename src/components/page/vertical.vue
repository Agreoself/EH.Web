<template>
    <pageheader :pageTitle="pageTitle" />
    <template v-for="(page, index) in pageInfoList">
        <el-row :gutter="5"> 
            <Button v-if="page.hasButton" :buttonInfo="page.buttonInfo" />
            <template v-if="page.hasTable">
                <el-card shadow="always">
                    <Table :tableInfo="page.tableInfo" @CallTable="OnTable(index, $event)" />
                </el-card>
            </template>
            <Form v-if="page.hasForm" :formInfo="page.formInfo" /> 
        </el-row>
    </template>
</template>

<script setup>
import pageheader from '@/components/layout/pageheader.vue';
import Table from '@/components/table/index.vue'
import Button from '@/components/button/index.vue'
import Form from '@/components/form/index.vue'
const props = defineProps(['pageInfo']);
const emits = defineEmits(['CallPage']);

const pageInfoList = props.pageInfo;

const pageTitle = pageInfoList[0].pageTitle;

const OnTable = (index, data) => {

    pageInfoList[index].tableInfo.value = data.table;
    let callbackdata = {
        components: 'table',
        module: 't' + index,
        componentsData: data
    };
    emits('CallPage', callbackdata);
}
</script>

<style lang="scss" scoped></style>