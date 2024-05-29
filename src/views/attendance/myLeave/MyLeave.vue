<template>  

  <!-- <el-row :gutter="5">
      <el-col v-for="item in balanceArr" :span="24/balanceArr.length">
 
      <el-card shadow="never" :body-style="card">
        <h1>{{item.type=='annual'?'年假':item.type=='personal'?"事假":'带薪病假'}}</h1>
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
    </el-row> -->
  <Button :buttonInfo="buttonInfo" />
  <el-card shadow="always">
    
    <Table ref="leaveTable" :tableInfo="tableInfo" @CallTable="OnTable" />
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
import allDic from '@/utils/dictionary'
import { message } from "@/utils/message"
let currentStateOptions=allDic["currentState"];
const leaveForm = new LeaveForm();
const leaveManage = new LeaveManage();
const userInfo = storage.get("userInfo");
const leaveTable=ref();

const route = useRoute(); // 第一步
// console.log(route.query); // 第二步
let stateValue=currentStateOptions.map(i=>i.value);
const stateCheckAll = ref(false); 
const handleCheckAll = (val) => {
  if (val) { 
    table.value.tableColumn.filter(i=>i.prop=='currentState'&&i.type=='int')[0].filterValue = stateValue
  } else {
    table.value.tableColumn.filter(i=>i.prop=='currentState'&&i.type=='int')[0].filterValue =[]
  } 
  let data = { currentState: val==true?stateValue:[] }
  qtable.value.Expose("filterChange", data,true)
}

const dialogVisible = ref(false);
const dialogKey = ref(0);
const dialogVisible1 = ref(false);
const dialogKey1 = ref(0);

const idList = ref([]);
let leaveId=ref();

let tableColumn = [
  { prop: "leaveId", label: "请假单号", sort: true, order: '', filterValue: '', width: 220, scope: false, type: 'string' }
  , { prop: "leaveType", label: "请假类型", sort: true, order: '', filterValue: '', width: 110, scope: true, type: 'int' }
  , { prop: "startDate", label: "开始时间", sort: true, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
  , { prop: "endDate", label: "结束时间", sort: true, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
  , { prop: "totalHours", label: "请假小时", sort: true, order: '', filterValue: '', width: 80, scope: false, type: 'string' }
  , { prop: "reason", label: "原因", sort: true, order: '', filterValue: '', width: 120, scope: false, type: 'string' }
  // , { prop: "attachment", label: "附件", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "currentState", label: "当前状态", sort: true, order: '', filterValue: '', width: 130, scope: true, type: 'int',multiple:true,header:{checkAll:stateCheckAll,handleCheckAll
  :handleCheckAll} }
  , { prop: "currentStep", label: "当前操作", sort: false, order: '', filterValue: '', width: 110, scope: false, type: 'nostring' }
  , { prop: "currentOwner", label: "当前处理人", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'nostring' }
  , { prop: "isCancel", label: "是否销假", sort: true, order: '', filterValue: '', width: 110, scope: true, type: 'int' }

  // , { prop: "isTreated", label: "是否结算", sort: false, order: '', filterValue: '', width: 90, scope: true, type: 'int' }

];
let table = toRef(page.tableInfo.createNew(46));
table.value.tableColumn = tableColumn;

let tableInfo = table;
let form = ref({});
let action = ref('apply')

let balanceArr=ref([]);

onMounted(async () => {
  if (route.query != undefined) {
    // let where=[];
    // console.log(route.query)
    Object.keys(route.query).forEach(i => {
      let data = {}
      data[i] = route.query[i];
      if (i == "currentState") {
        data[i] = route.query[i].split('&')
      }

      leaveTable.value.Expose("filterChange", data, i == "currentState")
      leaveTable.value.Expose("setFilterLabel", data)
      // where.push(i+"="+route.query[i]);
    })
    // let data={currentState:"1"};
    // leaveTable.value.Expose("setFilterLabel",data)

    // table.value.pageRequest.where=where.join(',');
  }
  GetData();

  //GetLeaveBalance();
});


let LeaveTypeCheckAll=()=>{
  let stateChecked= table.value.tableColumn.filter(i=>i.prop=='currentState'&&i.type=='int')[0].filterValue;
  if(stateChecked.length==0||stateChecked.length!=currentStateOptions.length){
    stateCheckAll.value=false;
  }
  if(stateChecked.length==currentStateOptions.length)
  {
    stateCheckAll.value=true;
  } 
}


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
// console.log(balanceArr.value)
}

let apply = () => {
  const userInfo = storage.get("userInfo");
  const userName = userInfo.userName;
  const department = userInfo.department;
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // 时区补偿 
  const formattedTime = now.toJSON().replace(/[-T:Z.]/g, '');
  let serialNum = userName + formattedTime;
  form.value = {
    leaveId: serialNum,
    userId: userName,
    department: department,
    leaveType: 'annual',
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
  if (idList.value.length == 0) {
    message.warning("请选择要撤销申请的数据");
  } 
  else if (idList.value.length > 1) {
    message.warning("无法撤销申请多条，请单选~");
  }
  else if (table.value.selectRow[0].currentState != '-1') {
    if (table.value.selectRow[0].isCancel == true) {
      message.warning("该假单已撤销")
    }
    else if(table.value.selectRow[0].currentState == 3){
      message.warning("该假单无需撤销")
    }
    else {
      const func = () => {
        form.value = table.value.selectRow[0];
        form.value.leaveTime = [table.value.selectRow[0].startDate, table.value.selectRow[0].endDate];
        form.value.isCancel = true;
        // let postJson = JSON.stringify(idList.value)
        leaveForm.cancel(form.value).then(res => {
          if (res.code == "000") {
            message.success("撤销申请成功");
            GetData()
          }
          else {
            message.error(res.message);
            form.value.isCancel = false;
          }
        })
      }
      message.confirm('确定申请撤销该请假？', func);
    }  
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
  if (idList.value.length == 0) {
    message.warning("请选择要查看的数据");
  } 
  else if (idList.value.length > 1) {
    message.warning("无法同时查看多条，请单选~");
  }else{
    dialogVisible1.value = true;
    dialogKey1.value = Math.random();
  }
}

let buttonInfo = ref([
  { size: 'small', type: 'primary', icon: 'Plus', click: apply, text: '申请休假' }
  , { size: 'small', type: 'primary', icon: 'Edit', click: edit, text: '编辑',displayCondition:()=>{return 1==1}  }
  , { size: 'small', type: 'danger', icon: 'back', click: deleteForm, text: '销假'  }
  , { size: 'small', type: 'primary', icon: 'View', click: process, text: '查看流程' }
  // , { size: 'small', type: 'primary', icon: 'SetUp', click: ()=>{}, text: '申请育儿假' }
])


const GetData = (iscallback) => {
  leaveTable.value.Expose("openLoading");
  table.value.pageRequest.defaultWhere=`userId=${userInfo.userName}`
  
  let postJson = JSON.stringify(table.value.pageRequest);
  leaveForm.getPageListWithState(postJson).then(res => {
    if (res.code == "000") {
      leaveTable.value.Expose("closeLoading");
      leaveTable.value.Expose("closeHeightlight");
      table.value.tableData = res.result;
      table.value.total = res.other;
      res.result.forEach(data=>{
        // console.log(tableRowClassName(data))
        leaveTable.value.Expose("setColumnColor", data);
      })
    } else {
      message.error(res.message)
    }
  });
}



const OnTable = (data) => {

  if(data.method=='filterChange'){
    // console.log(data.table.tableColumn)
    LeaveTypeCheckAll();
  }

  if(data.method=='cellClick')
  {
    if(data.column.property=="leaveId"){
      form.value=data.row
    form.value.leaveTime=[data.row.startDate,data.row.endDate];
    action.value = 'read';
    dialogVisible.value = true;
    dialogKey.value = Math.random();
    }
  }
  if(data.method=='rowDbClick')
  {
    // console.log(data.row)
    form.value=data.row
    form.value.leaveTime=[data.row.startDate,data.row.endDate];
    action.value = 'read';
    dialogVisible.value = true;
    dialogKey.value = Math.random();
  }
  idList.value = data.table.selectRow.map(i => i.id);
  if(data.table.currentRow!=undefined){
    if(data.table.selectRow[0]!=undefined)
    {
      leaveId.value=data.table.selectRow[0].leaveId
    }
    // leaveId.value=data.table.currentRow.leaveId;
  }
  if (data.needRefresh) {
    GetData(true);
  } 
}

const onApplyBack=(data)=>{
  if (data == true) {
    GetData(true)
    // GetLeaveBalance();
  }
}
const card = { padding: '10px', fontSize: '14.5px', height: '70px', fontColor:'red' }
</script>

<style lang="scss" scoped>
:deep(.el-card__body){
  padding: 12px;
}

:deep(.el-card__header) {
  padding: 5px;
}
</style>