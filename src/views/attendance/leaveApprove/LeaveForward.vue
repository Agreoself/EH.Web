<template>
  <el-dialog v-model="dialogVisible" :key="dialogKey" :title="title" width="30%" draggable center top="25vh">
    <el-form ref="applyForm" :model="form" label-width="110px" label-position="right" :rules="rules">
      <el-row>
          <el-form-item label="Forward To" prop="forwardto" style="width: 100%;">
            <el-input v-model="form.forwardto" placeholder="Input the email address to forward to"/>
          </el-form-item>
      </el-row>
      <!-- <el-row>
          <el-form-item label="New Status" prop="newStatus" style="width:100%">
            <el-select v-model="form.newStatus" style="width:100%" >
              <el-option v-for="option in currentStates" :key="option.value" :value="option.value" :label="option.label">
              </el-option>
            </el-select>
          </el-form-item>
      </el-row> -->
    </el-form>
    <template #footer> 
      <el-button @click="submit('agree')" type='success' :loading="btnLoading">确定</el-button> 
      <el-button @click="cancel">取消</el-button>
    </template>  
  </el-dialog>
</template>
 
<script setup>
import storage from "@/utils/storage"
import allDic from "@/utils/dictionary";
import { page } from '@/utils/pageinfo'; 
import { message } from "@/utils/message" 
import { useI18n } from "vue-i18n";
const {t} =useI18n();
 
import { LeaveForm } from "@/api/attendance/leaveForm"
const leaveForm = new LeaveForm();

const dialogVisible = ref(true);
let dialogKey = ref(0); 
let props = defineProps(["formValue", "action"]);
const emits = defineEmits(["applyBack"]);
let form = toRef(props.formValue);
 
let btnLoading=ref(false);

let applyForm = ref();
let title = ref("转发"); 

let currentStates = ref(allDic.currentState);
 
let rules = reactive({
  forwardto: [{ required: true, message: `forwardto不能为空`, trigger: 'blur' }],
  newStatus: [{ required: true, message: `newStatus不能为空`, trigger: 'blur' }], 
}) 

onMounted(async () => {
  
})
   
const submit = (audit = null) => {
  btnLoading.value=true;
  applyForm.value.validate((valid) => {
    if (valid) {
      form.value.createBy = '';
      form.value.modifyBy = '';
      form.value.startDate = form.value.leaveTime[0];
      form.value.endDate = form.value.leaveTime[1];
        
      const apiCallBack = (res) => {
        if (res.code == "000") {
          message.success("success");
          dialogVisible.value = false;
          emits('applyBack', true)
        }
        else {
          message.error(res.message);
        }
      } 
        // let json = { processID: form.value.processID, formID: form.value.formID, result: audit, comment: form.value.comment }
        // leaveForm.auditForm(json).then(res => {
        //   apiCallBack(res);
        //   btnLoading.value=false;
        // })
    } 
    else {
      message.warning('请查数据准确性');
      btnLoading.value=false;
    }
  })
}

 
const cancel = () => { dialogVisible.value = false; }

watch(dialogVisible, () => {
  emits('applyBack', true)
})

</script>

<style scoped>

</style>