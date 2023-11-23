<template>
    <NormalPage :pageInfo="pageRenderInfo" @CallPage="OnPage" />
    <LeaveApply v-if="dialogVisible" :key="dialogKey" :formValue="form" :action="action" @apply-back="onApplyBack" />
</template>


<script setup>
import { LeaveForm } from "@/api/attendance/leaveForm"
const leaveForm = new LeaveForm();
import storage from "@/utils/storage"
import NormalPage from "@/components/page/normal.vue";
import LeaveApply from '../myLeave/LeaveApply.vue';
import { message } from '@/utils/message';
import { page } from '@/utils/pageinfo';

const dialogVisible = ref(false);
const dialogKey = ref(0);
let form = ref({});
let action = ref('read')
let userId=storage.get('userInfo').userName
 
let idList = ref([]);
let tableColumn = [
    { prop: "leaveId", label: "请假单号", sort: true, order: '', filterValue: '', width: 220, scope: false, type: 'string' }
    , { prop: "leaveType", label: "请假类型", sort: false, order: '', filterValue: '', width: 100, scope: true, type: 'int' }
    , { prop: "startDate", label: "开始时间", sort: false, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
    , { prop: "endDate", label: "结束时间", sort: false, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
    , { prop: "totalHours", label: "请假小时", sort: false, order: '', filterValue: '', width: 80, scope: false, type: 'string' }
    , { prop: "reason", label: "原因", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "attachment", label: "附件", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "currentState", label: "当前状态", sort: false, order: '', filterValue: '', width: 100, scope: true, type: 'int' }
    , { prop: "isCancel", label: "是否销假", sort: false, order: '', filterValue: '', width: 80, scope: true, type: 'int' }

];
let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;

table.value.pageRequest.defaultWhere =`userId=${userId}`//'userId=clarkz'  //

onMounted(() => {
    GetData();
});

const GetData = () => {
    let postJson = JSON.stringify(table.value.pageRequest);
    leaveForm.getWatiAuditForm(postJson).then(res => {
        if (res.code == "000") {
            table.value.tableData = res.result;
            table.value.total = 100;
        } else {
            message.error(res.message)
        }
    });
}

const OnPage = (data) => {
    let components = data.components;
    let componentsData = data.componentsData;
    if (components == 'table') {
        table.value = componentsData.table;
        if (componentsData.needRefresh) {
            GetData();
        }
        idList.value = componentsData.table.selectRow.map(i => i.id);
    }
}

const audit = () => {
    if (idList.value.length == 0) {
        message.warning("请选择要审核的数据")
    }
    else if (idList.value.length > 1) {
        message.warning("无法审核多条，请单选~")
    }
    else {
        action.value = 'audit';
        form.value = table.value.selectRow[0];
        form.value.leaveTime = [table.value.selectRow[0].startDate, table.value.selectRow[0].endDate]
        dialogKey.value = Math.random();
        dialogVisible.value = true;
    }

}

const onApplyBack=(data)=>{
  if (data == true) {
    GetData() 
  }
}

let buttonInfo = ref([
    { size: 'small', type: 'primary', icon: 'Check', click: audit, text: '审核' }
    // , { size: 'small', type: 'primary', icon: 'Document', click: () => { }, text: '批量操作' }
])

let pageRenderInfo = ref({
    pageTitle: '休假审批',
    hasButton: true,
    hasTable: true,
    hasForm: false,
    buttonInfo: buttonInfo,
    tableInfo: table,
    formInfo: null
})




</script>

<style lang="scss" scoped></style>