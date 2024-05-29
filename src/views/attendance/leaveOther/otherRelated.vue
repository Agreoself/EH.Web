<template>
    <NormalPage ref="npage" :pageInfo="pageRenderInfo" @CallPage="OnPage" />
    <ParentalApply v-if="dialogVisible" :key="dialogKey" :formValue="form" :action="action" @apply-back="onApplyBack" />
</template>


<script setup>
import { OtherRelated } from "@/api/attendance/otherRelated"
const otherRelated = new OtherRelated();
import storage from "@/utils/storage"
import NormalPage from "@/components/page/normal.vue";
import ParentalApply from './ParentalApply.vue';
import { message } from '@/utils/message';
import { page } from '@/utils/pageinfo'; 
const { t, locale } = useI18n();
let npage=ref();
const dialogVisible = ref(false);
const dialogKey = ref(0);
let form = ref({});
let action = ref('read');
let userId=storage.get('userInfo').userName
 
let idList = ref([]);
let tableColumn = [
    { prop: "requestID", label: "申请单号", sort: true, order: '', filterValue: '', width: 220, scope: false, type: 'string' }
    , { prop: "userId", label: "用户名称", sort: true, order: '', filterValue: '', width: 120, scope: false, type: 'string' }
    // , { prop: "leaveType", label: "申请类型", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'int' }
    , { prop: "bornDate", label: "出生日期", sort: true, order: '', filterValue: '', width: 120, scope: false, type: 'date' } 
    , { prop: "description", label: "描述", sort: true, order: '', filterValue: '', width: 220, scope: false, type: 'string' }
    , { prop: "attachment", label: "附件", sort: false, order: '', filterValue: '', width: 200, scope: false, type: 'string' }
    , { prop: "currentState", label: "当前状态", sort: true, order: '', filterValue: '', width: 120, scope: true, type: 'int' }
];
let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;
table.value.pageRequest.order='createDate'
table.value.pageRequest.isDesc=true

 //'userId=clarkz'

onMounted(() => {
    GetData();
});

const GetData = () => {
    npage.value.Expose("table", "openLoading");
    if(!isHR()){
        table.value.pageRequest.defaultWhere =`userId=${userId}` 
    }
    let postJson = JSON.stringify(table.value.pageRequest);
    otherRelated.getPageList(postJson).then(res => {
        if (res.code == "000") { 
            npage.value.Expose("table","closeLoading")
            table.value.tableData = res.result;
            table.value.total = res.other;
        } else {
            message.error(res.message)
        }
    });
}

const OnPage =async (data) => {
    let components = data.components;
    let componentsData = data.componentsData;
    if (components == 'table') {
        table.value = componentsData.table;
        if (componentsData.needRefresh) {
            GetData();
        }
        if (componentsData.method == 'rowDbClick') {
            // console.log(data.row)
            form.value = componentsData.row
            form.value.leaveTime = [componentsData.row.startDate, componentsData.row.endDate];
            action.value = 'read';

            let data = { id: form.value.id }
            await otherRelated.getEntityById(data).then(res => {
                form.value.attachment = res.result.attachment;
            })

            dialogVisible.value = true;
            dialogKey.value = Math.random();
        }
        if (componentsData.method == 'cellClick') {
            if (componentsData.column.property == "requestID") {
                form.value = componentsData.row 
                action.value = 'read';

                let data = { id: form.value.id }
                await otherRelated.getEntityById(data).then(res => {
                    form.value.attachment = res.result.attachment;
                })
                
                dialogVisible.value = true;
                dialogKey.value = Math.random();
            }
        }
        idList.value = componentsData.table.selectRow.map(i => i.id);
    }
}

const audit = async () => {
    if (idList.value.length == 0) {
        message.warning("请选择要审核的数据")
    }
    else if (idList.value.length > 1) {
        message.warning("无法审核多条，请单选~")
    }
    else {
        action.value = 'audit';
        form.value = table.value.selectRow[0];
        if (form.value.currentState == 2 || form.value.currentState == 3) {
            message.warning("已审核，无需操作");
            return
        }

        let data = { id: form.value.id }
        await otherRelated.getEntityById(data).then(res => {
            form.value.attachment = res.result.attachment;
        })

        dialogKey.value = Math.random();
        dialogVisible.value = true;
    }
}

let apply = () => {
  const userInfo = storage.get("userInfo");
  const userName = userInfo.userName;
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // 时区补偿 
  const formattedTime = now.toJSON().replace(/[-T:Z.]/g, '');
  let serialNum = userName + formattedTime;
  form.value = {
    requestID: serialNum,
    userId: userName, 
    bronDate: '',
    description: '',
    attachment: '',
  };
  action.value = 'apply';
  dialogVisible.value = true;
  dialogKey.value = Math.random();
}
const onApplyBack=(data)=>{
  if (data == true) {
    GetData() 
  }
}

const isHR=()=>{
    let currentRole=storage.get('currentRole');
    const userRole=storage.get('userInfo').roleList;
    return userRole["HR"]==currentRole
}

let buttonInfo = ref([
    { size: 'small', type: 'primary', icon: 'plus', click: apply, text: '申请育儿假' }
    , { size: 'small', type: 'primary', icon: 'Document', click: audit, text: '审核',displayCondition:isHR }
])

let pageRenderInfo = ref({
    pageTitle: '其他相关',
    hasButton: true,
    hasTable: true,
    hasForm: false,
    buttonInfo: buttonInfo,
    tableInfo: table,
    formInfo: null
})




</script>

<style lang="scss" scoped></style>