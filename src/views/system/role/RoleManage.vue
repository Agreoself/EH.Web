<template>
  <HorizontalPage ref="hzPage" :pageInfo="pageInfo" @CallPage="OnPage" />
  <RoleOpera v-if="operateFormVisible" :key="operateKey" :formValue="form" :operateType="operateType"
    @operateBack="onMenuOpera" />
  <SetUser v-if="dialogFormVisible" :key="dialogKey" :roleList="idList" @operateBack="onSetUser" />
  <SetMenu v-if="setMenuVisible" :key="setMenuKey" :roleList="idList" @operateBack="onSetMenu" />
</template>
  
<script setup>
import storage from "@/utils/storage"
import { Role } from "@/api/system/role";
const role = new Role();
import { User } from "@/api/system/user";
const user = new User();

import HorizontalPage from '@/components/page/horizontal.vue';
import SetUser from './SetUser.vue';
import SetMenu from './SetMenu.vue';
import RoleOpera from './RoleOpera.vue';
import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'

const hzPage = ref();


let operateType = ref('add');
let operateKey = ref(0);
let operateFormVisible = ref(false);

let dialogKey = ref(0);
let dialogFormVisible = ref(false);

let setMenuKey = ref(0);
let setMenuVisible = ref(false);

let idList = ref([]);
let idList2 = ref([]);
let roleId = ref("");

let tableColumn = [
  { prop: "roleName", label: "角色名称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "roleDescript", label: "描述", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "roleKey", label: "角色Key", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "remark", label: "备注", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 200, scope: false, type: 'date' }
  , { prop: "modifyBy", label: "更改人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 200, scope: false, type: 'date' }
];

let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;


let tableColumn1 = [
  { prop: "userName", label: "用户名称", sort: false, filterValue: '', width: 100, scope: false, type: 'string' }
  , { prop: "fullName", label: "全称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "gender", label: "性别", sort: false, filterValue: '', width: 80, scope: true, type: 'int', options: storage.get("allDic")["gender"] }
  , { prop: "department", label: "部门", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "email", label: "邮箱", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "jobTitle", label: "职务", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "report", label: "上级", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }

];
let table1 = toRef(page.tableInfo.createNew(34));
table1.value.tableColumn = tableColumn1;
table1.value.pageRequest.defaultWhere = "roleId=" + roleId.value;

let form = ref({
  roleName: '',
  roleDescript: "",
  roleKey: "",
  remark: "",
  createBy: '',
  modifyBy: ''
});

onMounted(() => {
  GetData();
});

const GetData = () => {
  let postJson = JSON.stringify(table.value.pageRequest);
  role.getPageList(postJson).then(res => {
    if (res.code == "000") {
      hzPage.value.Expose(0,"closeLoading");
      table.value.tableData = res.result;
      table.value.total = res.other;
      if (res.result.length > 0) {
        table.value.currentRow = res.result[0]
        roleId.value = res.result[0].id;
        GetData2(roleId.value)
      }

    } else {
      message.error(res.message)
    }
  })
};

const GetData2 = (roleId) => {
  table1.value.pageRequest.defaultWhere = "roleId=" + roleId;
  let userPostJson = JSON.stringify(table1.value.pageRequest);
  user.GetUserListInRole(userPostJson).then(res => {
    if (res.code == "000") {
      hzPage.value.Expose(1,"closeLoading");
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
      if (componentsData.table.selectRow.length > 0) {
        idList.value = componentsData.table.selectRow.map(i => i.id);
      }
      else { idList.value = [] }
      componentsData.table.currentRow != undefined ? roleId.value = componentsData.table.currentRow.id : roleId.value = '-11';

    }
  }
  if (module == 't1') {
    if (components == 'table') {
      if (componentsData.needRefresh) {
        GetData2(roleId.value)
      }
      idList2.value = componentsData.table.selectRow.map(i => i.id);
    }
  }
}

watch(roleId, (newVal, oldVal) => {
  GetData2(newVal)
})

const onMenuOpera = (data) => {
  if (data == true) {
    GetData()
  }
}

const onSetUser = (data) => {
  if (data == true) {
    GetData2(roleId.value)
  }
}

const onSetMenu = (data) => {

}

const addRole = () => {
  operateType.value = 'add';
  operateFormVisible.value = true;
  operateKey.value = Math.random();
}

const deleteRole = () => {
  console.log(idList.value)
  if (idList.value.length == 0) {
    message.warning("请选择要删除的数据");
  }
  else {
    const func = () => {
      let postJson = JSON.stringify(idList.value)
      role.delete(postJson).then(res => {
        if (res.code == "000") {
          message.success("删除成功");
          GetData();
        }
        else {
          message.error(res.message);
        }
      })
    }
    message.confirm('确认删除选中数据？', func)
  }
}
const updateRole = () => {
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
    operateFormVisible.value = true;
    operateKey.value = Math.random();
  }
}

const deleteUserRole = () => {
  if (idList2.value.length == 0) {
    message.warning("请选择要删除的数据")
  }
  else {
    const func = () => {
      let json = { userIds: idList2.value, roleIds: idList.value }
      let postJson = JSON.stringify(json);
      role.deleteUserRole(postJson).then(res => {
        if (res.code == "000") {
          message.success("删除成功");
          GetData2(roleId.value);
        }
        else {
          message.error(res.message);
        }
      })
    }
    message.confirm('确认删除选中数据？', func)
  }
}

const setUser = () => {
  dialogFormVisible.value = true;
  dialogKey.value = Math.random();
}

const setMenu = () => {
  if (idList.value.length == 0) {
    message.warning("请选择要分配的角色")
  }
  else if (idList.value.length > 1) {
    message.warning("无法修改多条，请单选~")
  }
  else {
    setMenuVisible.value = true;
    setMenuKey.value = Math.random();
  }

}

let buttonInfo = ref([
  { size: 'small', type: 'primary', icon: 'Plus', click: addRole, text: '新增' }
  , { size: 'small', type: 'primary', icon: 'Edit', click: updateRole, text: '编辑' }
  , { size: 'small', type: 'primary', icon: 'Minus', click: deleteRole, text: '删除' }
  , { size: 'small', type: 'primary', icon: 'User', click: setUser, text: '设置用户' }
  , { size: 'small', type: 'primary', icon: 'Menu', click: setMenu, text: '分配权限' }
])

let buttonInfo1 = ref([
  { size: 'small', type: 'primary', icon: 'Minus', click: deleteUserRole, text: '删除' }
])


let pageInfo = ref([{
  pageTitle: '角色管理',
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
  formInfo: null
}])

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
  