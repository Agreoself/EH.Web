<template>
  <HorizontalPage ref="hzTable" :pageInfo="pageInfo" @CallPage="OnPage" />
</template>
  
<script setup>
import { User } from "@/api/system/user";
const user = new User();
import { LeaveManage } from "@/api/attendance/leaveManage";
const leaveManage = new LeaveManage();

import HorizontalPage from '@/components/page/horizontal.vue';
import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'

const hzTable = ref();

let operateType = ref('add');
let operateKey = ref(0);
let operateFormVisible = ref(false);

let idList = ref([]);
let id2List = ref([]);
let userId=ref();

let tableColumn = [
  { prop: "userName", label: "用户名称", sort: false, filterValue: '', width: 100, scope: false, type: 'string' }
  , { prop: "fullName", label: "全称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "gender", label: "性别", sort: false, filterValue: '', width: 80, scope: true, type: 'int', }
  , { prop: "department", label: "部门", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "startWorkDate", label: "开始工作时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
    , { prop: "ehiStratWorkDate", label: "入司时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
  , { prop: "jobTitle", label: "职务", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "report", label: "上级", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "lastReport", label: "最终上级", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
];
let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;

let tableColumn1 = [
  { prop: "leaveType", label: "类别", sort: false, filterValue: '', width: 100, scope: true, type: 'int' }
  , { prop: "total", label: "总数", sort: false, filterValue: '', width: 90, scope: false, type: 'string' }
  , { prop: "available", label: "可用", sort: false, filterValue: '', width: 90, scope: false, type: 'string', }
  , { prop: "used", label: "已用", sort: false, filterValue: '', width: 90, scope: false, type: 'string' }
  , { prop: "locked", label: "待批", sort: false, filterValue: '', width: 90, scope: false, type: 'string' }
  , { prop: "overdue", label: "延期", sort: false, filterValue: '', width: 90, scope: false, type: 'string' }
  , { prop: "remark", label: "备注", sort: false, filterValue: '', width: 90, scope: false, type: 'string' }
];

let table1 = toRef(page.tableInfo.createNew(34));
table1.value.tableColumn = tableColumn1;

let form = ref({});

onMounted(() => {
  GetData(); 
});

const GetData = () => {
  //  table1.value.pageRequest.defaultWhere = "roleId=" + roleId;
  let userPostJson = JSON.stringify(table.value.pageRequest);
  user.getPageList(userPostJson).then(res => {
    if (res.code == "000") {
      table.value.tableData = res.result;
      table.value.total = res.other;
      table.value.currentRow = res.result[0]
    } else {
      message.error(res.message)
    }
  })
}

const GetData2 = (userId) => {
  table1.value.pageRequest.defaultWhere = "userId=" + userId;
  let postJson = JSON.stringify(table1.value.pageRequest);
  leaveManage.getPageList(postJson).then(res => {
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
                userId.value = componentsData.table.currentRow.userName;
            else
                userId.value = null;
    }
  }
  if (module == 't1') {
    if (components == 'table') {
            if (componentsData.needRefresh) {
                GetData2(userId.value)
            }
            id2List.value = componentsData.table.selectRow.map(i => i.id);
        }
  }
}

watch(userId, (newVal, oldVal) => { 
    GetData2(newVal)  
})
 
let update = () => { }

let calcuteAnnualAndSick=()=>{
 
  let json={userId:table.value.selectRow[0].userName}
  console.log(json);
  leaveManage.calcuteAnnualAndSick(json).then(res=>{
    if(res.code=="000"){
      message.success(res.message)
      GetData2(table.value.selectRow[0].userName)
    }
  })
}

let buttonInfo1 = ref([
   { size: 'small', type: 'primary', icon: 'Edit', click: update, text: '编辑' }
])

let buttonInfo = ref([
    { size: 'small', type: 'primary', icon: 'SetUp', click:calcuteAnnualAndSick, text: '计算年假及病假' }
  , { size: 'small', type: 'primary', icon: 'Minus', click: () => { message.success('Data is being confirmed') }, text: '清空年假' }
  , { size: 'small', type: 'primary', icon: 'Timer', click: () => { message.success('Data is being confirmed')}, text: '延期年假' } 
  ,
])

const gerenalFormInfo = () => {

  let fields = [
    {
      type: 'input',
      label: '年假',
      prop: 'annual',
      placeholder: '年假剩余时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '病假',
      prop: 'sick',
      placeholder: '病假剩余时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '事假',
      prop: 'person',
      placeholder: '事假剩余时长',
      defaultValue: '0',
      min: 1,
      max: 10,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: 'Prenatal产检',
      prop: 'Prenatal',
      placeholder: '产检假期剩余时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: 'Parental育儿',
      prop: 'Parental',
      placeholder: '育儿假期剩余时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: 'paternity陪产',
      prop: 'paternity',
      placeholder: '陪产假期剩余时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '婚假',
      prop: 'marriage',
      placeholder: '婚假剩余时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update'],
      displayCondition: (formData) => {
        return formData.menuType == 1;
      },
    },
    {
      type: 'input',
      label: '丧假',
      prop: 'bereavement',
      placeholder: '丧假时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '护理假',
      prop: 'Nursing',
      placeholder: '护理假剩余时长',
      defaultValue: '0',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '产假',
      prop: 'maternity',
      placeholder: '产假时长',
      defaultValue: '0',
      min: 1,
      max: 10,
      operateType: ['add', 'update']
    },
  ];

  let buttonInfo = [
    { size: 'default', type: 'primary', icon: 'Plus', click: () => { }, text: '新增', operateType: ['add'] }
    , { size: 'default', type: 'primary', icon: 'Edit', click: () => { }, text: '编辑', operateType: ['update'] }
    , { size: 'default', type: 'default', icon: 'Cancel', click: () => { }, text: '取消', operateType: ['add', 'update'] }
  ]

  let formInfo = toRef(page.formInfo.createNew());
  formInfo.value.fields = fields;
  formInfo.value.formData = form.value;
  formInfo.value.hasButton = true;
  formInfo.value.buttonInfo = buttonInfo;

  return formInfo;
}

let pageInfo = ref([{
  pageTitle: '假期管理',
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
  formInfo: null,//gerenalFormInfo()
}])

</script>
  
<style scoped>
 
</style>
  