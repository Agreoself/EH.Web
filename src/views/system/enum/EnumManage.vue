<template>
    <HorizontalPage ref="hzTable" :pageInfo="pageInfo" @CallPage="OnPage" />
    <EnumOpera v-if="operateFormVisible" :key="operateKey" :formValue="form" :operateType="operateType"
        @operateBack="onEnumOpera" />
    <EnumItemOpera v-if="operate2FormVisible" :key="operate2Key" :enumTypeId="enumTypeId" :formValue="form2" :operateType="operate2Type"
        @operateBack="onEnumItemOpera"  />
</template>
    
<script setup>
import { Enum } from "@/api/system/enum";
const enums = new Enum();
import { EnumItem } from "@/api/system/enumitem";
const enumitem = new EnumItem();

import HorizontalPage from '@/components/page/horizontal.vue';
import EnumOpera from './EnumOpera.vue';
import EnumItemOpera from './EnumItemOpera.vue';
import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'

const hzTable = ref();

let operateType = ref('add');
let operateKey = ref(0);
let operateFormVisible = ref(false);

let operate2Type = ref('add');
let operate2Key = ref(0);
let operate2FormVisible = ref(false);

let idList = ref([]);
let id2List = ref([]);
let enumTypeId = ref(null);

let tableColumn = [
    { prop: "enumName", label: "字典名称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "enumCode", label: "字典编码", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "description", label: "字典描述", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 200, scope: false, type: 'date' }
    , { prop: "modifyBy", label: "更改人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 200, scope: false, type: 'date' }
];

let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;


let tableColumn1 = [
    { prop: "text", label: "项文本", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "value", label: "项值", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "parentId", label: "父节点id", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "description", label: "字典描述", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "sort", label: "排序", sort: false, filterValue: 1, width: 120, scope: false, type: 'int' }
    , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 200, scope: false, type: 'date' }
    , { prop: "modifyBy", label: "更改人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 200, scope: false, type: 'date' }
];
let table1 = toRef(page.tableInfo.createNew(34));
table1.value.tableColumn = tableColumn1;


let form = ref({});
let form2 = ref({});

onMounted(() => {
    GetData();
});

const GetData = () => {
    let postJson = JSON.stringify(table.value.pageRequest);
    enums.getPageList(postJson).then(res => {
        if (res.code == "000") {
            table.value.tableData = res.result;
            table.value.total = res.other;
            table.value.currentRow = res.result[0];
            if (res.result.length > 0) {
                enumTypeId.value = res.result[0].id;
            }
            GetData2(enumTypeId.value)
        } else {
            message.error(res.message)
        }
    })
};

const GetData2 = (enumTypeId) => {
    table1.value.pageRequest.defaultWhere = "enumTypeId=" + enumTypeId;
    let userPostJson = JSON.stringify(table1.value.pageRequest);
    enumitem.getPageList(userPostJson).then(res => {
        if (res.code == "000") {
            table1.value.tableData = res.result;
            table1.value.total = res.other;
            table1.value.currentRow = res.result[0]
        } else {
            message.error(res.message)
        }
    })
}


const OnPage = (data) => {
    let components = data.components;
    let componentsData = data.componentsData;
    let module = data.module;
    if (module == 't0') {
        if (components == 'table') {
            if (componentsData.needRefresh) {
                GetData()
            }
            idList.value = componentsData.table.selectRow.map(i => i.id);
            if (componentsData.table.currentRow != undefined)
                enumTypeId.value = componentsData.table.currentRow.id;
            else
                enumTypeId.value = null;
        }
    }
    if (module == 't1') {
        if (components == 'table') {
            if (componentsData.needRefresh) {
                GetData2(enumTypeId.value)
            }
            id2List.value = componentsData.table.selectRow.map(i => i.id);
        }
    }
}

watch(enumTypeId, (newVal, oldVal) => { 
    GetData2(newVal)  
})

const onEnumOpera = (data) => {
    if (data == true) {
        GetData()
    }
}

const onEnumItemOpera = (data) => {
    if (data == true) {
        GetData2(enumTypeId.value)
    }
}


const add2 = () => {
    form2.value = {};
    operate2Type.value = 'add';
    operate2FormVisible.value = true;
    operate2Key.value = Math.random();
}

const vDelete2 = () => {
    // console.log(id2List.value)
    if (id2List.value.length == 0) {
        message.warning("请选择要删除的数据");
    }
    else {
        const func = () => {
            let postJson = JSON.stringify(id2List.value)
            enumitem.delete(postJson).then(res => {
                if (res.code == "000") {
                    message.success("删除成功");
                    GetData2(enumTypeId.value);
                }
                else {
                    message.error(res.message);
                }
            })
        }
        message.confirm('确认删除选中数据？', func)
    }
}
const update2 = () => {
    if (id2List.value.length == 0) {
        message.warning("请选择要修改的数据")
    }
    else if (id2List.value.length > 1) {
        message.warning("无法修改多条，请单选~")
    }
    else {
        form2.value = table1.value.selectRow[0]
        operate2Type.value = 'update';
        operate2FormVisible.value = true;
        operate2Key.value = Math.random();
    }
}

const add = () => {
    form.value = {};
    operateType.value = 'add';
    operateFormVisible.value = true;
    operateKey.value = Math.random();
}

const vDelete = () => {
    if (idList.value.length == 0) {
        message.warning("请选择要删除的数据");
    }
    else {
        const func = () => {
            let postJson = JSON.stringify(idList.value)
            enums.delete(postJson).then(res => {
                if (res.code == "000") {
                    message.success("删除成功");
                    GetData();
                }
                else {
                    message.error(res.message);
                }
            })
        }
        message.confirm('即将删除字典及相关数据，请确认！', func)
    }
}
const update = () => {
    if (idList.value.length == 0) {
        message.warning("请选择要修改的数据")
    }
    else if (idList.value.length > 1) {
        message.warning("无法修改多条，请单选~")
    }
    else {
        form.value = table.value.selectRow[0]
        operateType.value = 'update';
        operateFormVisible.value = true;
        operateKey.value = Math.random();
    }
}



let buttonInfo = ref([
    { size: 'small', type: 'primary', icon: 'Plus', click: add, text: '新增' }
    , { size: 'small', type: 'primary', icon: 'Edit', click: update, text: '编辑' }
    , { size: 'small', type: 'primary', icon: 'Minus', click: vDelete, text: '删除' }
])

let buttonInfo1 = ref([
    { size: 'small', type: 'primary', icon: 'Plus', click: add2, text: '新增' }
    , { size: 'small', type: 'primary', icon: 'Edit', click: update2, text: '编辑' }
    , { size: 'small', type: 'primary', icon: 'Minus', click: vDelete2, text: '删除' }
])


let pageInfo = ref([{
    pageTitle: '字典管理',
    span: 12,
    hasButton: true,
    hasTable: true,
    hasForm: false,
    buttonInfo: buttonInfo,
    tableInfo: table,
    formInfo: null
}, {
    span: 12,
    hasButton: true,
    hasTable: true,
    hasForm: false,
    buttonInfo: buttonInfo1,
    tableInfo: table1,
    formInfo: null
}])

</script>
    
<style scoped></style>
    