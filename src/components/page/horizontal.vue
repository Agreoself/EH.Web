<template>
    <!-- <pageheader :pageTitle="pageTitle" /> -->
    <el-row :gutter="5">
        <template v-for="(page, index) in pageInfoList">
            <el-col :span="page.span">
                <Button v-if="page.hasButton" :buttonInfo="page.buttonInfo" />
                <template v-if="page.hasTable">
                    <el-card shadow="always">
                        <Table v-if="page.hasTable" :tableInfo="page.tableInfo" @CallTable="OnTable(index, $event)"
                            ref="table" />
                    </el-card>
                </template>
                <template v-if="page.hasForm">
                    <el-card shadow="always">
                        <Form ref="form" :formInfo="page.formInfo" :operateType="operateType" />
                    </el-card>
                </template>

            </el-col>
        </template>
    </el-row>
</template>

<script setup>
import pageheader from '@/components/layout/pageheader.vue';
import Table from '@/components/table/index.vue'
import Button from '@/components/button/index.vue'
import Form from '@/components/form/index.vue'
const props = defineProps(['pageInfo']);
const emits = defineEmits(['CallPage']);
const table = ref();
const form = ref();

let operateType = ref('add');

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

const OnForm = (index, data) => {
    let callbackdata = {
        components: 'form',
        module: 't' + index,
        componentsData: data
    };
    emits('CallPage', callbackdata);
}

const Expose = (module, method, data) => {
    if (method == 'setfilterLabel')
        table.value[module].Expose("setfilterLabel",data);
    if (method == 'filterChange')
        table.value[module].Expose("filterChange",data);
    if (method == 'closeLoading')
        table.value[module].Expose("closeLoading");
}

defineExpose({
    Expose
}
);

</script>

<style lang="scss" scoped></style>