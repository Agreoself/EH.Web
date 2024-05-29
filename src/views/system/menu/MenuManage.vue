<template>
  <NormalPage ref="npage" :pageInfo="pageRenderInfo" @CallPage="OnPage" />

  <MenuOpera v-if="dialogFormVisible" :key="dialogKey" :operateType="operateType" :formValue="form"
    @operateBack="onMenuOpera" :parent-menu-list="parentMenuList" />
</template>

<script setup>
import storage from "@/utils/storage";
import { Menu } from "@/api/system/menu";
const menu = new Menu();
import NormalPage from "@/components/page/normal.vue";
import MenuOpera from './MenuOpera.vue'
import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'
const npage=ref()
let idList = ref([]);

let parentMenuList = ref([]);

let operateType = ref('add');
let dialogKey = ref(0);
let dialogFormVisible = ref(false);

let defaultParams = ref({ label: "menuName", value: "id", checkStrictly: true, emitPath: false });
 

let form = ref({});

let tableColumn = [
  { prop: "menuName", label: "菜单名称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "menuType", label: "菜单类型", sort: false, filterValue: '', width: 100, scope: true, type: 'int', options:storage.get("allDic")["menuType"] }
  , { prop: "parentID", label: "父菜单ID", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "routeName", label: "路由名称", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "routePath", label: "路由路径", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "component", label: "组件路径", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "sort", label: "排序", sort: false, filterValue: '', width: 100, scope: false, type: 'string' }
  , { prop: "icon", label: "图标", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 120, scope: false, type: 'date' }
  , { prop: "modifyBy", label: "更新人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 120, scope: false, type: 'date' }
];

let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;

onMounted(() => {
  GetData();
});

const GetData = () => {
  let postJson = JSON.stringify(table.value.pageRequest);
  menu.getPageList(postJson).then(res => {
    if (res.code == "000") {
      npage.value.Expose("table","closeLoading")
      table.value.tableData = res.result;
      table.value.total = res.other;
      // parentMenuList.value = res.result.filter(i => i.menuType == 0);
      // parentMenuList.value.push({"menuName":"根目录",id:""}); 
      // console.log(res)
    } else {
      message.error(res.message)
    }
  });

  menu.GetParentMenuList().then((res) => {
    if (res.code == "000") {
      // console.log(res.result);
      parentMenuList.value = res.result;
      parentMenuList.value.push({ "menuName": "根目录", id: null });
    }
  });
};

const OnPage = (data) => {
  let components = data.components;
  let componentsData = data.componentsData;
  if (components == 'table') {
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

const InsertMenu = () => {
  operateType.value = 'add';
  form.value = {};
  dialogFormVisible.value = true;
  dialogKey.value = Math.random();
}

const deleteMenu = () => {
  // console.log(idList.value)
  if (idList.value.length == 0) {
    message.warning("请选择要删除的数据");
  }
  else {
    const func = () => {
      let postJson = JSON.stringify(idList.value)
      menu.delete(postJson).then(res => {
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

const UpdateMenu = () => {
  if (idList.value.length == 0) {
    message.warning("请选择要修改的数据")
  }
  else if (idList.value.length > 1) {
    message.warning("无法修改多条，请单选~")
  }
  else {
    console.log(table.value)

    form.value = table.value.selectRow[0]
    console.log(form.value)
    operateType.value = 'update';
    dialogFormVisible.value = true;
    dialogKey.value = Math.random();
  }
}

let buttonInfo = ref([
  { size: 'small', type: 'primary', icon: 'Plus', click: InsertMenu, text: '新增' }
  , { size: 'small', type: 'primary', icon: 'Edit', click: UpdateMenu, text: '编辑' }
  , { size: 'small', type: 'primary', icon: 'Minus', click: deleteMenu, text: '删除' }])

 
  
const gerenalFormInfo = () => {

  let fields = [
    {
      type: 'select',
      label: '菜单类型',
      prop: 'menuType',
      placeholder: '请选择菜单类型',
      defaultValue: '0',
      // options: storage.get("allDic")["menuType"],
      operateType: ['add'],

    },
    {
      type: 'cascader',
      label: '上级菜单',
      prop: 'parentID',
      placeholder: '请选择上级菜单',
      defaultValue: '',
      options: parentMenuList.value,
      defaultParams: defaultParams,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '菜单名称',
      prop: 'menuName',
      placeholder: '请输入菜单名称',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '路由路径',
      prop: 'routePath',
      placeholder: '请输入路由路径',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '路由名',
      prop: 'routeName',
      placeholder: '请输入路由名',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '组件路径',
      prop: 'component',
      placeholder: '请输入组件路径',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update'],
      displayCondition: (formData) => {
        console.log(formData.menuType == "0")
        return formData.menuType == "0";
      },
    },
    {
      type: 'input',
      label: '权限标识',
      prop: 'permissions',
      placeholder: '请输入权限标识',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
      type: 'input',
      label: '图标',
      prop: 'icon',
      placeholder: '请输入图标',
      defaultValue: '',
      max: 200,
      operateType: ['add', 'update']
    },
    {
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
    { size: 'default', type: 'primary', icon: 'Plus', click: addMenu, text: '新增', operateType: ['add'] }
    , { size: 'default', type: 'primary', icon: 'Edit', click: updateMenu, text: '编辑', operateType: ['update'] }
    , { size: 'default', type: 'default', icon: 'Cancel', click: cancel, text: '取消', operateType: ['add', 'update'] }
  ]

  let formInfo = toRef(page.formInfo.createNew());
  formInfo.value.fields = fields;
  formInfo.value.formData = form.value;
  formInfo.value.hasButton = true;
  formInfo.value.buttonInfo = buttonInfo;

  return formInfo;
}



let pageRenderInfo = ref({
  pageTitle: '菜单管理',
  hasButton: true,
  hasTable: true,
  hasForm: false,
  buttonInfo: buttonInfo,
  tableInfo: table,
  formInfo: null
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
