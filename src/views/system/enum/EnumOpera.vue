<template>
    <el-drawer v-model="dialogVisible" :title="dialogTitle" direction="rtl" size="30%">
        <Form :formInfo="formInfo" :operateType="props.operateType" />
    </el-drawer>
</template>
  
<script setup>
import { Enum } from "@/api/system/enum";
const enums = new Enum();
import { message } from "@/utils/message";
import { page } from '@/utils/pageinfo'
import Form from '@/components/form/index.vue'

const props = defineProps(["operateType", "formValue",]);
const emits = defineEmits(["operateBack"]);
let dialogVisible = ref(true);
const dialogTitle = ref(props.operateType == "add" ? "添加字典" : "编辑字典");
let form =toRef( props.formValue);

const cancel = () => {
    dialogVisible.value = false;
    emits('operateBack', true)
};

const addEnum = () => { 
  form.value.createBy='';
  form.value.modifyBy='';

  let postJson = JSON.stringify(form.value)
  enums.add(postJson).then(res => {
    if (res.code == "000") {
      message.success("添加成功")
      dialogVisible.value = false;
      emits('operateBack', true)
    }
  });
};

const updateEnum = () => { 
  let postJson = JSON.stringify(form.value)
  enums.update(postJson).then(res => {
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
  type: 'input',
  label: '字典名称',
  prop: 'enumName',
  placeholder: '请输入字典名称',
  defaultValue: '', 
  max: 200, 
  operateType: ['add','update'], 
},
{
  type: 'input',
  label: '字典编码',
  prop: 'enumCode',
  placeholder: '请输入字典编码',
  defaultValue: '',
  max: 200, 
  operateType: ['add','update']
},
{
  type: 'input',
  label: '字典描述',
  prop: 'description',
  placeholder: '请输入字典描述',
  defaultValue: '',
  max: 500,
  operateType: ['add','update']
},
];

let buttonInfo = [
{ size: 'default', type: 'primary', icon: 'Plus', click: addEnum, text: '新增', operateType: ['add'] }
, { size: 'default', type: 'primary', icon: 'Edit', click: updateEnum, text: '编辑', operateType: ['update'] }
, { size: 'default', type: 'default', icon: 'RefreshLeft', click: cancel, text: '取消', operateType: ['add','update'] }
]

let formInfo = toRef(page.formInfo.createNew());
formInfo.value.fields = fields;
formInfo.value.formData = form.value;
formInfo.value.hasButton = true;
formInfo.value.buttonInfo = buttonInfo;

return formInfo;
}

let formInfo = gerenalFormInfo();

</script>

<style lang="scss" scoped></style>