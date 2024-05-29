<template>
      <el-dialog width="70%" :title="dialogTitle" v-model="dialogVisible" center draggable top="3vh" > 
        <!-- <el-checkbox-group v-model="setUserParams.userIdList">
          <el-checkbox :label="item.roleId" v-for="item in roleAllList" :key="item.roleId">
            {{ item.roleName }}
          </el-checkbox>
        </el-checkbox-group> -->
      
          <UserTable ref="utable"  :tableInfo="table" @CallTable="OnTable"/>
      
        <template #footer>
          <el-button @click="cancel" size="default">Cancel</el-button>
          <el-button type="primary" @click="confim" size="default">Confim</el-button>
        </template>
      
      </el-dialog>
</template>

<script setup>
import UserTable from '@/components/table/index.vue';
import {User} from '@/api/system/user'
const user=new User();
import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'
const utable=ref();
const dialogTitle=ref('设置用户');
const dialogVisible=ref(true);
let props=defineProps(['roleList']);
let roleList=props.roleList;

const emits =defineEmits(["operateBack"]);
let setUserParams=ref({
      userIds:[],
      roleIds:[] 
}
);

let idList = ref([]); 
 
 

let tableColumn= [
    { prop: "userName", label: "用户名称", sort: false, filterValue: '', width: 120,scope:false,type:'string' }
    , { prop: "fullName", label: "全称", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    // , { prop: "gender", label: "性别", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:[{value: 1,label: "男",},{value: 2,label: "女",},]}
    , { prop: "department", label: "部门", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "email", label: "邮箱", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "jobTitle", label: "职务", sort: false, filterValue: '', width: 120, scope:false,type:'string'}
    , { prop: "report", label: "上级", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    , { prop: "isActive", label: "状态", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:[{value: 'true',label: "启用",},{value: 'false',label: "禁用",},] }
    // , { prop: "isAdmin", label: "是否管理员", sort: false, filterValue: '', width: 120, scope:true,type:'int',options:[{value: 'true',label: "是",},{value: 'false',label: "否",},] }
    , { prop: "startWorkDate", label: "开始工作时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
    , { prop: "ehiStratWorkDate", label: "入司时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
    , { prop: "cc", label: "抄送人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    // , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    // , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 120,scope:false,type:'date'}
    // , { prop: "modifyBy", label: "更改人", sort: false, filterValue: '', width: 120, scope:false,type:'string' }
    // , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 120, scope:false,type:'date' }
  ];
let table = toRef(page.tableInfo.createNew(95));
table.value.tableColumn = tableColumn;

const OnTable = (data) => { 
  table.value = data.table;
  if (data.needRefresh) {
    GetData();
  }
  idList.value = data.table.selectRow.map(i => i.id); 
}


onMounted(() => {
  GetData()
});

const GetData=()=>{
  let postJson = JSON.stringify(table.value.pageRequest);
  user.getPageList(postJson).then(res => {
    if (res.code == "000") {
      utable.value.Expose("closeLoading");
      table.value.tableData = res.result;
      table.value.total = res.other; 
    } else {
      message.error(res.message)
    }
  })
}

const cancel=()=>{
      
}

const confim=()=>{
  // console.log(roleList)
  // console.log(idList.value)
  setUserParams.value.roleIds=roleList;
  setUserParams.value.userIds=idList.value;
  console.log(setUserParams.value);
  let postJson=JSON.stringify(setUserParams.value);
  user.grantRole(postJson).then(res=>{
    if(res.code=="000"){
      message.success("success");
      emits("operateBack",true)
      dialogVisible.value=false;
    }
    else
    {
      message.error(res.message);
      emits("operateBack",false);
      dialogVisible.value=false;
    }
  })
}

</script>

<style  scoped>


 
/*
element.style {
    padding-bottom: 0px;
} */
</style>