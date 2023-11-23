<template>
    <el-drawer v-model="dialogVisible" :title="dialogTitle" direction="rtl" size="30%">
        <Form :formInfo="formInfo" :operateType="props.operateType" />
    </el-drawer>
</template>
  
<script setup>
import { LeaveSetting } from "@/api/attendance/leaveSetting";
const leaveSetting = new LeaveSetting();
import { message } from "@/utils/message";
import { page } from '@/utils/pageinfo'
import Form from '@/components/form/index.vue'

const props = defineProps(["operateType", "formValue",]);
const emits = defineEmits(["operateBack"]);
let dialogVisible = ref(true);
const dialogTitle = ref(props.operateType == "add" ? "添加假期设置" : "编辑假期设置");
let form = toRef(props.formValue);

const cancel = () => {
    dialogVisible.value = false;
    emits('operateBack', true)
};

const addLeaveSetting = () => {
    form.value.createBy = '';
    form.value.modifyBy = '';
    let postJson = JSON.stringify(form.value)
    console.log(postJson)
    leaveSetting.add(postJson).then(res => {
        if (res.code == "000") {
            message.success("添加成功")
            dialogVisible.value = false;
            emits('operateBack', true)
        }
    });
};

const updateLeaveSetting = () => {
    let postJson = JSON.stringify(form.value);
    
    leaveSetting.update(postJson).then(res => {
        if (res.code == "000") {
            message.success("操作成功")
            dialogVisible.value = false;
            emits('operateBack', true)
        }
    })
};

const gerenalFormInfo = () => {
    let fields = [
        {
            type: 'select',
            label: '假期类型',
            prop: 'leaveType',
            placeholder: '请选择假期类型',
            defaultValue: '',
            operateType: ['add', 'update'],
        },
        {
            type: 'select',
            label: '资格',
            prop: 'qualification',
            placeholder: '请选择资格',
            defaultValue: '',
            operateType: ['add', 'update'],
        },
        {
            type: 'number',
            label: '限额',
            prop: 'limit',
            placeholder: '请输入限额',
            defaultValue: 0,
            max: 999999,
            operateType: ['add', 'update']
        },
        {
            type: 'select',
            label: '请假最小单位',
            prop: 'minUnit',
            placeholder: '请输入请假最小单位',
            defaultValue: '', 
            operateType: ['add', 'update']
        },
        {
            type: 'radio',
            label: '是否包含节假日',
            prop: 'isContainHoliday',
            placeholder: '请输入限额',
            defaultValue: '', 
            operateType: ['add', 'update']
        },
        {
            type: 'input',
            label: '计算表达式',
            prop: 'calculationRule',
            placeholder: '请输入计算表达式',
            defaultValue: '',
            max: 500,
            operateType: ['add', 'update']
        },
        {
            type: 'input',
            label: '描述',
            prop: 'Description',
            placeholder: '请输入描述',
            defaultValue: '',
            max: 500,
            operateType: ['add', 'update']
        },
    ];

    let buttonInfo = [
        { size: 'default', type: 'primary', icon: 'Plus', click: addLeaveSetting, text: '新增', operateType: ['add'] }
        , { size: 'default', type: 'primary', icon: 'Edit', click: updateLeaveSetting, text: '编辑', operateType: ['update'] }
        , { size: 'default', type: 'default', icon: 'RefreshLeft', click: cancel, text: '取消', operateType: ['add', 'update'] }
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