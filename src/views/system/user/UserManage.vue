<template> 
  <NormalPage ref="npage" :pageInfo="pageRenderInfo" @CallPage="OnPage"/>
  <UserOpera v-if="dialogFormVisible" :key="dialogKey" :formValue="form" :operateType="operateType"
   @operateBack="onMenuOpera" />

   <UserFromAD v-if="dialogFormVisible1" :key="dialogKey1" :formValue="form" :operateType="operateType"
   @operateBack="onMenuOpera" />

   <SetRole v-if="setRoleShow" :user-id="idList" :key="setRoleKey" @setRoleBack="onSetRole" />
</template>

<script setup>
import storage from "@/utils/storage";
import UserOpera from './UserOpera.vue' 
import UserFromAD from './UserFromAD.vue' 
import SetRole from './SetRole.vue' 
import {  User } from "@/api/system/user";  
const user=new User();  
import { message } from '@/utils/message'  
import NormalPage from "@/components/page/normal.vue";
import {page} from '@/utils/pageinfo'
 const npage=ref()

let idList = ref([]); 

let operateType = ref('add');
let dialogKey = ref(0);
let dialogFormVisible = ref(false); 

let dialogKey1 = ref(0);
let dialogFormVisible1 = ref(false); 

let setRoleKey = ref(0);
let setRoleShow = ref(false); 
let onSetRole=(data)=>{
  if (data == true) {
    GetData()
  }
}


let tableColumn=[
    { prop: "userName", label: "用户名称", sort: false, filterValue: '', width: 120,scope:false,type:'string' }
    , { prop: "fullName", label: "全称", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "gender", label: "性别", sort: false, filterValue: '', width: 80, scope:true,type:'int',options:storage.get("allDic")["gender"]}
    , { prop: "department", label: "部门", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "email", label: "邮箱", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "jobTitle", label: "职务", sort: false, filterValue: '', width: 120, scope:false,type:'string'}
    , { prop: "report", label: "上级", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "lastReport", label: "最终上级", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "isActive", label: "状态", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:storage.get("allDic")["isActive"] }
    // , { prop: "isAdmin", label: "是否管理员", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:storage.get("allDic")["isAdmin"] }
    , { prop: "startWorkDate", label: "开始工作时间", sort: false, filterValue: '', width: 130, scope:false,type:'date' }
    , { prop: "ehiStratWorkDate", label: "入司时间", sort: false, filterValue: '', width: 130, scope:false,type:'date' }
    , { prop: "cc", label: "抄送", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 120,scope:false,type:'date'}
    , { prop: "modifyBy", label: "更改人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
  ];
 
let table=toRef(page.tableInfo.createNew(34)); 
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
  user.getPageList(postJson).then(res => {
    if (res.code == "000") {
      npage.value.Expose("table","closeLoading");
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

const addUserFormAD=()=>{
  dialogFormVisible1.value = true;
  dialogKey1.value = Math.random();
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
  if(idList.value.length>1){
    message.warning("无法同时设置多个用户，请单选~")
  }
  else if(idList.value.length==0){
    message.warning("请选择要设置的用户")
  }
  else
  {
    setRoleShow.value=true;
    setRoleKey.value=Math.random();
  }
    
}

const Sync=()=>{ 
    message.info("Coming soon~") 
}

let buttonInfo=ref([
  {size:'small',type:'primary',icon:'Edit',click:UpdateUser,text:'编辑'}
,{size:'small',type:'primary',icon:'Place',click:GrantRole,text:'分配角色'}
,{size:'small',type:'primary',icon:'Sort',click:Sync,text:'同步用户'}
,{size:'small',type:'primary',icon:'Place',click:addUserFormAD,text:'从AD添加用户'}
]) 

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
