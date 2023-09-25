<template> 
  <NormalPage :pageInfo="pageRenderInfo" @CallPage="OnPage"/>
  <UserOpera v-if="dialogFormVisible" :key="dialogKey" :formValue="form" :operateType="operateType"
   @operateBack="onMenuOpera" />
</template>

<script setup>
import UserOpera from './UserOpera.vue' 
import {  GetUserPageList } from "@/api/user";    
import { message } from '@/utils/message'  
import NormalPage from "@/components/page/normal.vue";
import {page} from '@/utils/pageinfo'
 

let idList = ref([]); 

let operateType = ref('add');
let dialogKey = ref(0);
let dialogFormVisible = ref(false); 

let tableColumn=[
    { prop: "userName", label: "用户名称", sort: false, filterValue: '', width: 120,scope:false,type:'string' }
    , { prop: "fullName", label: "全称", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "gender", label: "性别", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:[{value: 1,label: "男",},{value: 2,label: "女",},]}
    , { prop: "department", label: "部门", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "email", label: "邮箱", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "jobTitle", label: "职务", sort: false, filterValue: '', width: 120, scope:false,type:'string'}
    , { prop: "report", label: "上级", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "isActive", label: "状态", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:[{value: 'true',label: "启用",},{value: 'false',label: "禁用",},] }
    , { prop: "isAdmin", label: "是否管理员", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:[{value: 'true',label: "是",},{value: 'false',label: "否",},] }
    , { prop: "startWorkDate", label: "开始工作时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
    , { prop: "ehiStratWorkDate", label: "入司时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
    , { prop: "cc", label: "抄送人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 120,scope:false,type:'date'}
    , { prop: "modifyBy", label: "更改人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
  ];
 
let table=toRef(page.tableInfo.createNew()); 
table.value.tableColumn=tableColumn; 

let form = ref({
  userName: '',
  fullName: "",
  gender: "",
  department: "",
  email: "",
  report: "",
  isAdmin: false,
  startWorkDate: "",
  cc: '', 
  createBy: '',
  modifyBy: ''
});

onMounted(() => {
  GetData();
});

const GetData = () => {
  let postJson = JSON.stringify(table.value.pageRequest);
  GetUserPageList(postJson).then(res => {
    if (res.code == "000") {
      table.value.tableData = res.result;
      table.value.total = res.other; 
    } else {
      message.error(res.message)
    }
  })
};
 
const OnPage = (data) => { 

  let components=data.components;
  let componentsData=data.componentsData;
  if(components=='table'){
    table.value = componentsData.table;
  if (componentsData.needRefresh) {
    GetData();
  }
  idList.value = componentsData.table.selectRow.map(i => i.id); 
  }
  
}

const onMenuOpera = (data) => {
  if (data == true) {
    GetData()
  }
}

const UpdateUser = () => {
  if (idList.value.length == 0) {
    message.warning("请选择要修改的数据")
  }
  else if (idList.value.length > 1) {
    message.warning("无法修改多条，请单选~")
  }
  else {

    form.value = table.value.selectRow[0]
    console.log(form.value)
    operateType.value = 'update';
    dialogFormVisible.value = true;
    dialogKey.value = Math.random();
  }
}

const GrantRole=()=>{ 
    message.info("Coming soon~") 
}

let buttonInfo=ref([
  {size:'small',type:'primary',icon:'Edit',click:UpdateUser,text:'编辑'}
,{size:'small',type:'primary',icon:'Place',click:GrantRole,text:'分配角色'}
,{size:'small',type:'primary',icon:'Sort',click:GrantRole,text:'同步用户'}]) 

let pageRenderInfo=ref({
  pageTitle:'用户管理',
  hasButton:true,
  hasTable:true,
  hasForm:false,
  buttonInfo:buttonInfo,
  tableInfo:table,
  formInfo:null
})

</script>

<style scoped>
.header {
  /*display: flex;*/
  /*!*垂直对齐*!*/
  /*align-items: center;*/
  height: 60px;
  background-color: #EAEEED;
}

.page-header {
  float: left;
  margin-top: 20px
} 
  
.box-card {
  height: 100%;
}
  
</style>
