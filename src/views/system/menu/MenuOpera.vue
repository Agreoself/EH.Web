<template>
  <el-drawer v-model="dialogVisible" :title="dialogTitle" direction="rtl" size="30%">
    <Form :formInfo="formInfo" :operateType="props.operateType" />
  </el-drawer> 
</template>

<script setup>
import { Menu } from "@/api/system/menu";
const menu=new Menu();
import { message } from "@/utils/message";
import { page } from '@/utils/pageinfo'
import Form from '@/components/form/index.vue'

const props = defineProps(["operateType", "formValue", "parentMenuList"]);
const emits = defineEmits(["operateBack"]);
let dialogVisible = ref(true);
const dialogTitle = ref(props.operateType == "add" ? "添加菜单" : "编辑菜单");

let parentMenuList = ref([]);
let defaultParams = ref({ label: "menuName", value: "id", checkStrictly: true, emitPath: false }); 
let options = ref([{ value: 0,label: "目录",},{value: 1,label: "组件",},]);
let form=toRef(props.formValue); 
  
onMounted(() => {
  menu.GetParentMenuList().then((res) => {
    if (res.code == "000") {
      // console.log(res.result)
      // // let s= res.result.map(item=>{return {
      // //   menuName:item.menuName,
      // //   id:item.id,
      // //   children:item.children
      // // }}); 
      parentMenuList.value.push({ "menuName": "根目录", id: '00000000-0000-0000-0000-000000000000' });
      res.result.forEach(element => {
        parentMenuList.value.push(element);
      }); 
    
      // console.log(parentMenuList.value)
    }
  }); 
}) 

const cancel = () => {
  dialogVisible.value = false;
  emits('operateBack', true)
};

const addMenu = () => { 
  form.value.createBy='';
  form.value.modifyBy='';
  let postJson = JSON.stringify(form.value)
  console.log(postJson) 
  menu.add(postJson).then(res => {
    if (res.code == "000") {
      message.success("添加成功")
      dialogVisible.value = false;
      emits('operateBack', true)
    }
  })

};

const updateMenu = () => {
  console.log(form.value)

  let postJson = JSON.stringify(form.value)
  menu.update(postJson).then(res => {
    if (res.code == "000") {
      message.success("操作成功")
      dialogVisible.value = false;
      emits('operateBack', true)
    }
  })

};

const gerenalFormInfo=()=>{

let fields = [
{
  type: 'select',
  label: '菜单类型',
  prop: 'menuType',
  placeholder: '请选择菜单类型',
  defaultValue: '',
  options: options, 
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
  operateType: ['add','update']
},
{
  type: 'input',
  label: '菜单名称',
  prop: 'menuName',
  placeholder: '请输入菜单名称',
  defaultValue: '',
  max: 200, 
  operateType: ['add','update']
},
{
  type: 'input',
  label: '路由路径',
  prop: 'routePath',
  placeholder: '请输入路由路径',
  defaultValue: '',
  max: 200,
  operateType: ['add','update']
},
{
  type: 'input',
  label: '路由名',
  prop: 'routeName',
  placeholder: '请输入路由名',
  defaultValue: '',
  max: 200,
  operateType: ['add','update']
},
{
  type: 'input',
  label: '组件路径',
  prop: 'component',
  placeholder: '请输入组件路径',
  defaultValue: '',
  max: 200,
  operateType: ['add','update'],
  displayCondition: (formData) => {
      return formData.menuType == 1;
    },
},
{
  type: 'input',
  label: '权限标识',
  prop: 'permissions',
  placeholder: '请输入权限标识',
  defaultValue: '',
  max: 200,
  operateType: ['add','update']
},
{
  type: 'input',
  label: '图标',
  prop: 'icon',
  placeholder: '请输入图标',
  defaultValue: '',
  max: 200,
  operateType: ['add','update']
},
{
  type: 'number',
  label: '排序',
  prop: 'sort',
  placeholder: '请输入排序',
  defaultValue: 1,
  min: 1,
  max: 10,
  operateType: ['add','update']
},
{
  type: 'input',
  label: '备注',
  prop: 'remark',
  placeholder: '请输入备注',
  defaultValue: '',
  max: 520,
  operateType: ['add','update']
},
];

let buttonInfo = [
{ size: 'default', type: 'primary', icon: 'Plus', click: addMenu, text: '新增', operateType: ['add'] }
, { size: 'default', type: 'primary', icon: 'Edit', click: updateMenu, text: '编辑', operateType: ['update'] }
, { size: 'default', type: 'default', icon: 'RefreshLeft', click: cancel, text: '取消', operateType: ['add','update'] }
]

let formInfo = toRef(page.formInfo.createNew());
formInfo.value.fields = fields;
formInfo.value.formData = form.value;
formInfo.value.hasButton = true;
formInfo.value.buttonInfo = buttonInfo;

return formInfo;
}

// let formInfo = props.formInfo;
let formInfo=gerenalFormInfo();
// console.log(formInfo)
  

// const selectMenuType = () => {
//   if (form.menuType == 0) {
//     menu.GetParentMenuList().then((res) => {
//       if (res.code == "000") {
//         console.log(res.result);
//         parentMenuList.value = res.result;
//         parentMenuList.value.push({ "menuName": "根目录", id: null });
//       }
//     });
//   }
// };



</script>

<style scoped>
 
</style>
