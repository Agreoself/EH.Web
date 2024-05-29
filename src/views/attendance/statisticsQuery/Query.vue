<template> 
 
  <Button :buttonInfo="buttonInfo" />
  <el-card shadow="always">
    <Table ref="qtable" :tableInfo="table" @CallTable="OnTable" />
  </el-card>
  <LeaveProcess v-if="processVisible" :key="processKey" :leaveId="leaveId"/>
  <LeaveApply v-if="dialogVisible" :key="dialogKey" :formValue="form" :action="action" @apply-back="onApplyBack" />

</template>

<script setup>
const { t } = useI18n()
import LeaveApply from '../myLeave/LeaveApply.vue';
const dialogVisible = ref(false);
const dialogKey = ref(0);
let form = ref({});
let action = ref('read');
const onApplyBack=(data)=>{
  // if (data == true) {
  //   GetData(true)
  //   // GetLeaveBalance();
  // }
}

import Table from '@/components/table/index.vue';
import Button from '@/components/button/index.vue';
import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'
import { LeaveForm } from "@/api/attendance/leaveForm"
const leaveForm = new LeaveForm();
import storage from "@/utils/storage"
import { useI18n } from 'vue-i18n';
import LeaveProcess from '../myLeave/LeaveProcess.vue';
import allDic from '@/utils/dictionary' 
const qtable=ref();

const isHr=()=>{
    let currentRole=storage.get('currentRole');
    const userRole=storage.get('userInfo').roleList;
    return userRole["HR"]==currentRole||userRole["超级管理员"]==currentRole
}
//isHr()?storage.get("allDic").leaveType.filter(i=>i.value=="annual"):
let checkType = ref( storage.get("allDic").leaveType);
let currentStateOptions=allDic["currentState"].filter(i=>i.value!="-1");
// console.log(currentStateOptions)

const shortcuts = [
  {
    text: 'Last Month',
    value: () => {
      const current = new Date();
      var lastDayOfPreMonth = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
      var end = new Date(current.getFullYear(), current.getMonth() - 1, lastDayOfPreMonth);
      const start = new Date()
      start.setDate(1);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'This Year',
    value: () => {
      const current = new Date();
      const start = new Date(current.getFullYear(), 0, 1)
      const end = new Date(current.getFullYear(), 11, 31);
      // start.setDate(1); 
      return [start, end]
    },
  }]
let leaveId=ref();
const processVisible = ref(false);
const processKey = ref(0);

// 获取当前日期
var currentDate = new Date();
// 获取当前月份的第一天
var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
// 获取当前月份的最后一天
var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); 
const defaultTime = [firstDayOfMonth.toLocaleDateString(),lastDayOfMonth.toLocaleDateString()]


let typeValue=checkType.value.map((_) => _.value);
let stateValue=currentStateOptions.map(i=>i.value);
const checkAll = ref(false)
const stateCheckAll = ref(false) 
const handleCheckAll = (val) => {
 
  if (val) { 
    table.value.tableColumn.filter(i=>i.prop=='leaveType'&&i.type=='int')[0].filterValue = typeValue
  } else {
    table.value.tableColumn.filter(i=>i.prop=='leaveType'&&i.type=='int')[0].filterValue =[]
  }
  let data = { leaveType: val==true?typeValue:[] }
  qtable.value.Expose("filterChange", data,true)
}

const handleCheckAll1 = (val) => {
  if (val) { 
    table.value.tableColumn.filter(i=>i.prop=='currentState'&&i.type=='int')[0].filterValue = stateValue
  } else {
    table.value.tableColumn.filter(i=>i.prop=='currentState'&&i.type=='int')[0].filterValue =[]
  }
  let data = { currentState: val==true?stateValue:[] }
  qtable.value.Expose("filterChange", data,true)
}
  
let idList = ref([]); 
let tableColumn = [
{ prop: "leaveId", label: "请假单号", sort: true, order: '', filterValue: '', width: 220, scope: false, type: 'string' }
,{ prop: "fullName", label: "用户名称", sort: true, filterValue: '', width: 100, scope: false, type: 'string' }
,{ prop: "chineseName", label: "中文名", sort: true, filterValue: '', width: 140, scope: false, type: 'string' }
  , { prop: "department", label: "部门", sort: true, filterValue: '', width: 110, scope: false, type: 'string', }
  , { prop: "leaveType", label: "请假类型", sort: true, order: '', filterValue: isHr()?['annual']: '', width: 160, scope: true, type: 'int',multiple:true,header:{checkAll:checkAll,handleCheckAll
  :handleCheckAll} }
  , { prop: "startDate", label: "开始时间", sort: true, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
  , { prop: "endDate", label: "结束时间", sort: true, order: '', filterValue: '', width: 160, scope: false, type: 'date' }
  , { prop: "currentState", label: "当前状态", sort: true, order: '', filterValue: '', width: 120, scope: true, type: 'int',multiple:true,options:currentStateOptions,header:{checkAll:stateCheckAll,handleCheckAll
  :handleCheckAll1} }
  , { prop: "currentStep", label: "当前操作", sort: false, order: '', filterValue: '', width: 110, scope: false, type: 'nostring' }
  , { prop: "currentOwner", label: "当前处理人", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'nostring' }
  , { prop: "isCancel", label: "是否销假", sort: true, order: '', filterValue: '', width: 110, scope: true, type: 'int' }
  , { prop: "isTreated", label: "是否结算", sort: true, order: '', filterValue:isHr()?'false': '', width: 100, scope: true, type: 'int' } 
  , { prop: "totalHours", label: "请假小时", sort: true, order: '', filterValue: '', width: 80, scope: false, type: 'string' }
  // , { prop: "reason", label: "原因", sort: true, order: '', filterValue: '', width: 120, scope: false, type: 'string' }
  // , { prop: "attachment", label: "附件", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'string' } 
];
let table = toRef(page.tableInfo.createNew(46));
table.value.tableColumn = tableColumn;
table.value.pageRequest.order='startDate';
table.value.pageRequest.isDesc=true;

// if (isHr()) {
//     table.value.pageRequest.where += 'isTreated=false,leaveType=[annual]'
//   }

const setDepartmentDisable=()=>{
  nextTick(()=>{
    let department = storage.get('userInfo').department
    let data = { department: department }
    qtable.value.Expose("filterChange", data)
    qtable.value.Expose("setFilterLabel", data)
    
  })
  let disabled = !isHr();
    return disabled;
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

let process=()=>{
  if (idList.value.length == 0) {
    message.warning("请选择要查看的数据");
  } 
  else if (idList.value.length > 1) {
    message.warning("无法同时查看多条，请单选~");
  }else{
    processVisible.value = true;
    processKey.value = Math.random();
  }

}

let buttonInfo = ref([
 { size: 'small', type: 'success', icon: 'Document', click: treated, text: '结算',displayCondition:isHr }
 , { size: 'small', type: 'primary', icon: 'View', click: process, text: '查看流程' }
])

let LeaveTypeCheckAll=()=>{
  let typeChecked= table.value.tableColumn.filter(i=>i.prop=='leaveType'&&i.type=='int')[0].filterValue;
  let stateChecked= table.value.tableColumn.filter(i=>i.prop=='currentState'&&i.type=='int')[0].filterValue;
  // console.log(checked)
  // console.log(checkType.value)
  if(typeChecked.length==0||typeChecked.length!=checkType.value.length){
    checkAll.value=false;
  }
  if(typeChecked.length==checkType.value.length)
  {
    checkAll.value=true;
  } 

  if(stateChecked.length==0||stateChecked.length!=currentStateOptions.length){
    stateCheckAll.value=false;
  }
  if(stateChecked.length==currentStateOptions.length)
  {
    stateCheckAll.value=true;
  } 
}



onMounted(() => {
  if (isHr()) {
    let data = [{key:'leaveType',value:['annual'],multiple:true},
    {key:'isTreated',value:false,multiple:false}]
    qtable.value.Expose("multiplefilterChange", data);
  }
  else {
    GetData();
  }
  //GetData();

  // let treatedData={isTreated:true}
  // qtable.value.Expose("filterChange", treatedData,false);

});


const GetData = () => {
 
  qtable.value.Expose("openLoading")
  table.value.pageRequest.defaultWhere = `userId=${storage.get('userInfo').userName},isHR=${isHr()}`
  // if (isHr()) {
  //   table.value.pageRequest.where += 'isTreated=false,leaveType=[annual]'
  // }
  let postJson = table.value.pageRequest;
  leaveForm.queryGetpagelist(postJson).then(res => {
    qtable.value.Expose("closeLoading")
    table.value.tableData = res.result;
    table.value.total = res.other;
  }) 
}

const OnTable =async (data) => {
  if(data.method=='cellClick')
  {
 
    if (data.column.property == "leaveId") {
      form.value = data.row
      form.value.leaveTime = [data.row.startDate, data.row.endDate];
      action.value = 'read';
      // console.log(form.value)
      let getData = { id: form.value.id }
      await leaveForm.getEntityById(getData).then(res => {
        form.value.attachment = res.result.attachment;
      })

      dialogVisible.value = true;
      dialogKey.value = Math.random();
    }
  }
  if(data.method=='filterChange'){
    // console.log(data.table.tableColumn)
    //console.log(data.table)
    // if (isHr()) {
    //   table.value.pageRequest.where += 'isTreated=false,leaveType=[annual]'
    // }
     LeaveTypeCheckAll();
  }

  table.value = data.table;
  if (data.needRefresh) {
    GetData();
  }

  idList.value = data.table.selectRow.map(i => i.id);
  if(data.table.currentRow!=undefined){
    if(data.table.selectRow[0]!=undefined){
      leaveId.value=data.table.selectRow[0].leaveId;
    }
    // leaveId.value=data.table.currentRow.leaveId;
  }

  
}
</script>
 
<style lang="scss" scoped></style>