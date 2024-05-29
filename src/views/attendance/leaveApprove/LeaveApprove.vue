<template>
    <NormalPage ref="npage" :pageInfo="pageRenderInfo" @CallPage="OnPage" />
    <LeaveApply v-if="dialogVisible" :key="dialogKey" :formValue="form" :action="action" @apply-back="onApplyBack" />
    <LeaveForward v-if="fdialogVisible" :key="fdialogKey" :formValue="forwardForm" @apply-back="onApplyBack" />
    <LeaveProcess v-if="dialogVisible1" :key="dialogKey1" :leaveId="leaveId" />
</template>

<script setup>
import LeaveProcess from '../myLeave/LeaveProcess.vue';
import { LeaveForm } from "@/api/attendance/leaveForm";
const leaveForm = new LeaveForm();
import storage from "@/utils/storage";
import NormalPage from "@/components/page/normal.vue";
import LeaveApply from '../myLeave/LeaveApply.vue';
import LeaveForward from './LeaveForward.vue';
import { message } from '@/utils/message';
import { page } from '@/utils/pageinfo';
import { ElLoading } from 'element-plus';
const { t, locale } = useI18n();
const route = useRoute();
let userId = storage.get('userInfo').userName
let department = storage.get('userInfo').department

let npage = ref();

const dialogVisible = ref(false);
const dialogKey = ref(0);
const dialogVisible1 = ref(false);
const dialogKey1 = ref(0);
let leaveId = ref();

const fdialogVisible = ref(false);
const fdialogKey = ref(0);
let form = ref({});
let forwardForm = ref({});
let action = ref('read');
let showAll = ref(false);

let idList = ref([]);
let tableColumn = [
    { prop: "leaveId", label: "请假单号", sort: true, order: '', filterValue: '', width: 220, scope: false, type: 'string' }
    , { prop: "leaveType", label: "请假类型", sort: true, order: '', filterValue: '', width: 110, scope: true, type: 'int' }
    , { prop: "startDate", label: "开始时间", sort: true, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
    , { prop: "endDate", label: "结束时间", sort: true, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
    , { prop: "totalHours", label: "请假小时", sort: true, order: '', filterValue: '', width: 80, scope: false, type: 'string' }
    , { prop: "reason", label: "原因", sort: true, order: '', filterValue: '', width: 120, scope: false, type: 'string' }
    , { prop: "attachment", label: "附件", sort: false, order: '', filterValue: '', width: 130, scope: false, type: 'string' }
    , { prop: "currentState", label: "当前状态", sort: true, order: '', filterValue: '', width: 120, scope: true, type: 'int' }
    , { prop: "isCancel", label: "是否销假", sort: true, order: '', filterValue: '', width: 110, scope: true, type: 'int' }
    , { prop: "isTreated", label: "是否结算", sort: true, order: '', filterValue: '', width: 100, scope: true, type: 'int' }
];
let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;
// http://localhost:8088/#/leaveApprove?leaveId=paceyl20231219095748117
onMounted(async () => {
    if (route.query != undefined) {
        Object.keys(route.query).forEach(i => {
            let data = {};
            data[i] = route.query[i];
            npage.value.Expose("table", "filterChange", data)
            npage.value.Expose("table", "setFilterLabel", data)
        })
    }
    //   table.value.pageRequest.defaultWhere =`userId=${userId}` 
    GetData()

});

const GetData = () => {
    if (showAll.value) {
        if (!isAdmin() && !isHr()) {
            table.value.pageRequest.defaultWhere = `department=${department}`
        }
        else {
            table.value.pageRequest.defaultWhere = ''
        }
        table.value.pageRequest.order = 'currentState';
        if (table.value.pageRequest.where == "")
            table.value.pageRequest.where = 'currentState=[2&1&0]';
        else
            table.value.pageRequest.where += ',currentState=[2&1&0]';

        let postJson = JSON.stringify(table.value.pageRequest);
        leaveForm.getPageList(postJson).then(res => {
            if (res.code == "000") {
                npage.value.Expose("table", "closeLoading");
                npage.value.Expose("table", "closeHeightlight");
                table.value.tableData = res.result;
                table.value.total = res.other;

                let where = table.value.pageRequest.where.split('currentState=[2&1&0]').join("").split(',').join('');
                table.value.pageRequest.where = where;
            } else {
                message.error(res.message)
            }
        });
    }
    else {
        //table.value.pageRequest.defaultWhere ='userId=encix' // `userId=${userId}`
        table.value.pageRequest.defaultWhere = `userId=${userId}`
        let postJson = JSON.stringify(table.value.pageRequest);
        leaveForm.getWatiAuditForm(postJson).then(res => {
            if (res.code == "000") {
                npage.value.Expose("table", "closeLoading");
                table.value.tableData = res.result;
                table.value.total = res.other;
            } else {
                message.error(res.message)
            }
        });
    }
}

const OnPage =async (data) => {
    let components = data.components;
    let componentsData = data.componentsData;
    if (components == 'table') {
        // console.log(componentsData.table)
        table.value = componentsData.table;
        if (componentsData.needRefresh) {
            GetData();
        }
        if (componentsData.method == 'cellClick') {
            if (componentsData.column.property == "leaveId") {
                form.value = componentsData.row
                form.value.leaveTime = [componentsData.row.startDate, componentsData.row.endDate];
                action.value = 'audit';
  
                let data = { id: form.value.formID }
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Attachment Loading...',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                 
                await leaveForm.getEntityById(data).then(res => { 
                    form.value.attachment = res.result.attachment;
                    loading.close();
                })
               


                dialogVisible.value = true;
                dialogKey.value = Math.random();
            }
        }
        if (componentsData.method == 'rowDbClick') {
            // console.log(data.row)
            form.value = componentsData.row
            form.value.leaveTime = [componentsData.row.startDate, componentsData.row.endDate];
            action.value = 'read';
 
            const loading = ElLoading.service({
                lock: true,
                text: 'Attachment Loading...',
                background: 'rgba(0, 0, 0, 0.7)',
            })

            let data = { id: form.value.formID }
            await leaveForm.getEntityById(data).then(res => {
                form.value.attachment = res.result.attachment;
            })
            loading.close();


            dialogVisible.value = true;
            dialogKey.value = Math.random();
        }
        idList.value = showAll.value ? componentsData.table.selectRow.map(i => i.id) : componentsData.table.selectRow.map(i => i.formID);
        if (componentsData.table.currentRow != undefined) {
            if(componentsData.table.selectRow[0]!=undefined)
            leaveId.value = componentsData.table.selectRow[0].leaveId;
            // leaveId.value = componentsData.table.currentRow.leaveId;
        }
    }

    if (components == "button") {
        if (componentsData.method == "switchChange") {
            showAll.value = componentsData.data;
            // npage.value.Expose("table", "clearFilter");
            GetData();
        }
    }


}

const audit =async () => {
    if (idList.value.length == 0) {
        message.warning("请选择要审核的数据")
    }
    else if (idList.value.length > 1) {
        message.warning("无法审核多条，请单选~")
    }
    else {
        if (table.value.selectRow[0].currentState == '2' || table.value.selectRow[0].currentState == '3') {
            message.warning("该假单已审核，无需操作")
            return;
        }
        action.value = 'audit';
        form.value = table.value.selectRow[0];
        form.value.leaveTime = [table.value.selectRow[0].startDate, table.value.selectRow[0].endDate]

        let data = { id: form.value.formID }
        const loading = ElLoading.service({
            lock: true,
            text: 'Attachment Loading...',
            background: 'rgba(0, 0, 0, 0.7)',
        })

        await leaveForm.getEntityById(data).then(res => {
            form.value.attachment = res.result.attachment;
            loading.close();
        })
               

        dialogKey.value = Math.random();
        dialogVisible.value = true;
    }
}

const forward = () => {
    if (idList.value.length == 0) {
        message.warning("请选择要操作的数据")
    }
    else if (idList.value.length > 1) {
        message.warning("无法操作多条，请单选~")
    }
    else {
        form.value = table.value.selectRow[0];
        fdialogKey.value = Math.random();
        fdialogVisible.value = true;
    }
}

const treated = () => {
    let ids = idList.value;
    leaveForm.treate(ids).then(res => {
        if (res.code == "000") {
            message.success(res.message);
            GetData();
        } else {
            message.error(res.message)
        }
    })
}


const onApplyBack = (data) => {
    if (data == true) {
        GetData()
    }
}

const isAdmin = () => {
    let currentRole = storage.get('currentRole');
    const userRole = storage.get('userInfo').roleList;
    return userRole["超级管理员"] == currentRole
}

const isHr = () => {
    let currentRole = storage.get('currentRole');
    const userRole = storage.get('userInfo').roleList;
    return userRole["HR"] == currentRole || userRole["超级管理员"] == currentRole
}

const hasApprovalPermissions = () => {
    let currentRole = storage.get('currentRole');
    const userRole = storage.get('userInfo').roleList;
    return userRole["HR"] == currentRole || userRole["超级管理员"] == currentRole || userRole["审批组"] == currentRole
}

let process=()=>{
    if (idList.value.length == 0) {
      message.warning("请选择要查看的数据")
    }
    else if (idList.value.length > 1) {
      message.warning("无法查看多条，请单选~")
    } else {
      dialogVisible1.value = true;
      dialogKey1.value = Math.random();
    }
}
let buttonInfo = ref([
    { size: 'small', type: 'primary', icon: 'Menu', click: audit, text: '操作' }
    , { size: 'small', type: 'primary', icon: 'View', click: process, text: '查看流程' }
    // , { size: 'small', type: 'success', icon: 'Document', click: treated, text: '结算',displayCondition:isHr }
    , { size: 'small', type: 'danger', icon: 'Document', click: forward, text: '转发', displayCondition: isAdmin }
])

let dynamicInfo = ref([
    // { size: 'small', type: 'switch', value:false, activeText: t('显示所有'),inactiveText:t('未审批'),displayCondition:hasApprovalPermissions }
])

let pageRenderInfo = ref({
    pageTitle: '休假审批',
    hasButton: true,
    hasTable: true,
    hasForm: false,
    buttonInfo: buttonInfo,
    dynamicInfo: dynamicInfo,
    tableInfo: table,
    formInfo: null
})




</script>

<style lang="scss" scoped></style>