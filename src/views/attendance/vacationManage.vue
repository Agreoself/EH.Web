<template>
  <HorizontalPage ref="hzTable" :pageInfo="pageInfo" @CallPage="OnPage" />
</template>
  
<script setup>
import { GetRolePageList, DeleteRole } from "@/api/role";
import { GetUserListInRole } from "@/api/user";
import HorizontalPage from '@/components/page/horizontal.vue';

import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'

const hzTable = ref();


let operateType = ref('add');
let operateKey = ref(0);
let operateFormVisible = ref(false);

let dialogKey = ref(0);
let dialogFormVisible = ref(false);

let setMenuKey = ref(0);
let setMenuVisible = ref(false);

let idList = ref([]);
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

let table = toRef(page.tableInfo.createNew());
table.value.tableColumn = tableColumn;


let tableColumn1 = [
  { prop: "userName", label: "用户名称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "fullName", label: "全称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "gender", label: "性别", sort: false, filterValue: '', width: 120, scope: true, type: 'int', options: [{ value: 1, label: "男", }, { value: 2, label: "女", },] }
  , { prop: "department", label: "部门", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "email", label: "邮箱", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "jobTitle", label: "职务", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "report", label: "上级", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }

];
let table1 = toRef(page.tableInfo.createNew());
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
  GetRolePageList(postJson).then(res => {
    if (res.code == "000") {
      table.value.tableData = res.result;
      table.value.total = res.other;
      table.value.currentRow = res.result[0]
      roleId.value = res.result[0].id;
      GetData2(roleId.value)
    } else {
      message.error(res.message)
    }
  })
};

const GetData2 = (roleId) => {
  table1.value.pageRequest.defaultWhere = "roleId=" + roleId;
  let userPostJson = JSON.stringify(table1.value.pageRequest);
  GetUserListInRole(userPostJson).then(res => {
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
      roleId.value = componentsData.table.currentRow.id;
    }
  }
  if (module == 't1') {
    // console.log(componentsData)
    // if (components == 'table') {
    //   table1.value.pageRequest.defaultWhere = "roleId=" + roleId.value;
    //   if (componentsData.needRefresh) { 
    //     GetData2(roleId.value)
    //   }
    //   idList.value = componentsData.table.selectRow.map(i => i.id); 
    // }
  }
}

watch(roleId, (newVal, oldVal) => {
  GetData2(newVal)
})


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
      DeleteRole(postJson).then(res => {
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

const setUser = () => {
  dialogFormVisible.value = true;
  dialogKey.value = Math.random();
}

const setMenu = () => {
  setMenuVisible.value = true;
  setMenuKey.value = Math.random();
}

let buttonInfo = ref([
  { size: 'small', type: 'primary', icon: 'Plus', click: addRole, text: '新增' }
  , { size: 'small', type: 'primary', icon: 'Edit', click: updateRole, text: '编辑' }
  , { size: 'small', type: 'primary', icon: 'Minus', click: deleteRole, text: '删除' }
  , { size: 'small', type: 'primary', icon: 'User', click: setUser, text: '设置用户' }
  , { size: 'small', type: 'primary', icon: 'Menu', click: setMenu, text: '分配权限' }
])

let buttonInfo1 = ref([
  { size: 'small', type: 'primary', icon: 'Minus', click: deleteRole, text: '删除' }
])

const gerenalFormInfo = () => {

  let fields = [
    {
      span: 24,
      type: 'select',
      label: '菜单类型',
      prop: 'menuType',
      placeholder: '请选择菜单类型',
      defaultValue: 0,
      options: [],
      operateType: ['add'],

    },
    {
      span: 24,
      type: 'cascader',
      label: '上级菜单',
      prop: 'parentID',
      placeholder: '请选择上级菜单',
      defaultValue: '',
      options: [],
      defaultParams: [],
      operateType: ['add', 'update']
    },
    {
      span: 24,
      type: 'input',
      label: '菜单名称',
      prop: 'menuName',
      placeholder: '请输入菜单名称',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      span: 24,
      type: 'input',
      label: '路由路径',
      prop: 'routePath',
      placeholder: '请输入路由路径',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      span: 24,
      type: 'input',
      label: '路由名',
      prop: 'routeName',
      placeholder: '请输入路由名',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      span: 24,
      type: 'input',
      label: '组件路径',
      prop: 'component',
      placeholder: '请输入组件路径',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update'],
      displayCondition: (formData) => {
        return formData.menuType == 1;
      },
    },
    {
      span: 24,
      type: 'input',
      label: '权限标识',
      prop: 'permissions',
      placeholder: '请输入权限标识',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      span: 24,
      type: 'input',
      label: '图标',
      prop: 'icon',
      placeholder: '请输入图标',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      span: 24,
      type: 'number',
      label: '排序',
      prop: 'sort',
      placeholder: '请输入排序',
      defaultValue: 1,
      min: 1,
      max: 10,
      operateType: ['add', 'update']
    },
    {
      span: 24,
      type: 'input',
      label: '备注',
      prop: 'remark',
      placeholder: '请输入备注',
      defaultValue: '',
      max: 520,
      operateType: ['add', 'update']
    },
  ];

  let buttonInfo = [
    // { size: 'default', type: 'primary', icon: 'Plus', click: addMenu, text: '新增', operateType: ['add'] }
    // , { size: 'default', type: 'primary', icon: 'Edit', click: updateMenu, text: '编辑', operateType: ['update'] }
    // , { size: 'default', type: 'default', icon: 'Cancel', click: cancel, text: '取消', operateType: ['add', 'update'] }
  ]

  let formInfo = toRef(page.formInfo.createNew());
  formInfo.value.fields = fields;
  formInfo.value.formData = form.value;
  formInfo.value.hasButton = true;
  formInfo.value.buttonInfo = buttonInfo;

  return formInfo;
}


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
  hasButton: false,
  hasTable: false,
  hasForm: true,
  buttonInfo: buttonInfo1,
  tableInfo: table1,
  formInfo: gerenalFormInfo()
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
  