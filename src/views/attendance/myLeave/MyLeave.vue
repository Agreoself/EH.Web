<template>
 
  <el-row :gutter="5">
      <el-col v-for="item in balanceArr" :span="24/balanceArr.length">
 
      <el-card shadow="never" :body-style="card">
        <h1>{{item.type=='annual'?'年假':'带薪病假'}}</h1>
        <el-row>
          <el-col :span="6">
          <el-card shadow="always">总数 {{item.total}} h</el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">可用 {{item.available}} h</el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">已用 {{item.used}} h</el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">待批 {{item.locked}} h</el-card>
        </el-col>
      </el-row>
      </el-card>
    </el-col>
    </el-row>
  <Button :buttonInfo="buttonInfo" />
  <el-card shadow="always">
    <Table :tableInfo="tableInfo" @CallTable="OnTable" />
  </el-card>
  <LeaveApply v-if="dialogVisible" :key="dialogKey" :formValue="form" :action="action" @apply-back="onApplyBack" />
  <LeaveProcess v-if="dialogVisible1" :key="dialogKey1" :leaveId="leaveId"/>
</template>

<script setup>
import Table from '@/components/table/index.vue'
import Button from '@/components/button/index.vue'
import { page } from '@/utils/pageinfo'
import LeaveApply from './LeaveApply.vue';
import LeaveProcess from './LeaveProcess.vue';
import { LeaveForm } from "@/api/attendance/leaveForm"
import { LeaveManage } from "@/api/attendance/leaveManage"
import storage from "@/utils/storage";
import { message } from "@/utils/message"
const leaveForm = new LeaveForm();
const leaveManage = new LeaveManage();
const userInfo = storage.get("userInfo");

const leavetypes = [
  { type: 'anmual', title: '年假', balance: '120' },
  { type: 'anmual', title: '病假', balance: '56' },
  // { type: 'anmual', title: '丧假', balance: '24' },
]


const dialogVisible = ref(false);
const dialogKey = ref(0);
const dialogVisible1 = ref(false);
const dialogKey1 = ref(0);

const idList = ref([]);
let leaveId=ref();

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
let table = toRef(page.tableInfo.createNew(34 + 80));
table.value.tableColumn = tableColumn;

let tableInfo = table;
let form = ref({});
let action = ref('apply')

let balanceArr=ref([]);

onMounted(async () => {
  GetData();
   GetLeaveBalance();
});

let GetLeaveBalance=async ()=>{
  const userInfo = storage.get("userInfo");
  const userName = userInfo.userName;
  let pageRequest={
  pageIndex: 1,
  pageSize: 15,
  where: "",
  order: "leaveType",
  defaultWhere: `userId=${userName}`
}
await leaveManage.getPageList(pageRequest).then(res=>{
  if(res.code=="000"){
    balanceArr.value=[];
    if(res.result.length>0){
      res.result.forEach(item=>{
      let obj={type:'',total:0,available:0,used:0,locked:0,};
      obj.type=item.leaveType
      obj.total=item.total,
      obj.available=item.available,
      obj.used=item.used,
      obj.locked=item.locked,
      balanceArr.value.push(obj)
    })
    }
    else
    {
      let annual={type:'annual',total:'未计算',available:0,used:0,locked:0,};
      let sick={type:'sick',total:'未计算',available:0,used:0,locked:0,};
      balanceArr.value.push(annual);
      balanceArr.value.push(sick);
    }
    
    // balanceArr.value= res.result.map(i=>i.leaveType);

  }
  // console.log(res.result)
})
console.log(balanceArr.value)
}

let apply = () => {
  const userInfo = storage.get("userInfo");
  const userName = userInfo.userName;
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // 时区补偿 
  const formattedTime = now.toJSON().replace(/[-T:Z.]/g, '');
  let serialNum = userName + formattedTime;
  form.value = {
    leaveId: serialNum,
    userId: userName,
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: '',
    totalHour: 0,
    leaveTime:[]
  };
  action.value = 'apply';
  dialogVisible.value = true;
  dialogKey.value = Math.random();
}

let edit = () => {
  if (idList.value.length == 0) {
    message.warning("请选择要修改的数据")
  }
  else if (idList.value.length > 1) {
    message.warning("无法修改多条，请单选~")
  }
  else if(table.value.selectRow[0].currentState!='-1'){
    message.warning("开始流程的数据无法编辑")
  }
  else {
    action.value = 'edit';
    form.value = table.value.selectRow[0]
    form.value.leaveTime=[table.value.selectRow[0].startDate,table.value.selectRow[0].endDate]
    dialogVisible.value = true;
    dialogKey.value = Math.random();
  }
}

let deleteForm = () => {
  debugger
  if (idList.value.length == 0) {
    message.warning("请选择要删除的数据")
  } 
  else if(table.value.selectRow.filter(i=>i.currentState!='-1').length>=1){
    message.warning("开始流程的数据无法删除")
  }
  else {
    const func = () => {
      let postJson = JSON.stringify(idList.value)
      leaveForm.delete(postJson).then(res => {
        if (res.code == "000") {
          message.success("删除成功");
          GetData()
        }
        else {
          message.error(res.message);
        }
      })
    }
    message.confirm('确认删除选中数据？', func)
  }
}

let process=()=>{
  dialogVisible1.value = true;
  dialogKey1.value = Math.random();
}

let buttonInfo = ref([
  { size: 'small', type: 'primary', icon: 'Plus', click: apply, text: '申请休假' }
  , { size: 'small', type: 'primary', icon: 'Edit', click: edit, text: '编辑'  }
  , { size: 'small', type: 'danger', icon: 'minus', click: deleteForm, text: '删除'  }
  , { size: 'small', type: 'primary', icon: 'View', click: process, text: '查看流程' }
])


const GetData = () => {
  table.value.pageRequest.defaultWhere=`userId=${userInfo.userName}`
  table.value.pageRequest.order='currentState'
  let postJson = JSON.stringify(table.value.pageRequest);
  leaveForm.getPageList(postJson).then(res => {
    if (res.code == "000") {
      table.value.tableData = res.result;
      table.value.total = res.other;
    } else {
      message.error(res.message)
    }
  });

}

const OnTable = (data) => {

  idList.value = data.table.selectRow.map(i => i.id);
  if(data.table.currentRow!=undefined){
    leaveId.value=data.table.currentRow.leaveId;
  }
  if (data.needRefresh) {
    GetData();
  } 
}

const onApplyBack=(data)=>{
  if (data == true) {
    GetData()
    GetLeaveBalance();
  }
}
const card = { padding: '10px', fontSize: '14.5px', height: '70px', fontColor:'red' }
</script>

<style lang="scss" scoped>
.el-card__body {
    padding:0px;
}

:deep(.el-card__header) {
  padding: 5px;
}
</style>