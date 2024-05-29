<template>
  <!-- <el-dialog width="35%" :title="dialogTitle" v-model="dialogVisible" center draggable> -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" size="30%" center>
    <el-form :model="form" style="padding: 0px 20px" size="default">

      <el-row>
        <el-col :span="18">
          <el-form-item :label="t('用户名称')" :label-width="formLabelWidth">
            <el-input v-model="form.userName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="success" style="margin-left:15px ;" @click="getADinfo">{{'读取用户AD信息'}}</el-button>
        </el-col>
      </el-row>

      <el-row>
          <el-form-item :label="t('职务')" :label-width="formLabelWidth">
            <el-input v-model="form.jobTitle" autocomplete="off"></el-input>
          </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item :label="t('性别')" :label-width="formLabelWidth">
            <el-select v-model="form.gender" class="m-2" placeholder="Select" style="width:100%">
              <el-option v-for="item in genders" :key="item.value" :label="t(item.label)" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item :label="t('部门')" :label-width="formLabelWidth">
            <el-input v-model="form.department" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('上级')" :label-width="formLabelWidth">
            <el-input v-model="form.report" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('最终上级')" :label-width="formLabelWidth">
            <el-input v-model="form.lastReport" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('开始工作时间')" :label-width="formLabelWidth">
            <el-date-picker v-model="form.startWorkDate" type="date" placeholder="Select date and time"
              style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('入司时间')" :label-width="formLabelWidth">
            <el-date-picker v-model="form.ehiStratWorkDate" type="date" placeholder="Select date and time"
              style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('抄送')" :label-width="formLabelWidth">
            <el-input v-model="form.cc" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('抄送时长')" :label-width="formLabelWidth">
            <el-input v-model="form.ccHours" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">{{ t('取消') }}</el-button>
        <el-button type="primary" @click="add">{{ t('保存') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
const { t } = useI18n()
import { User } from "@/api/system/user";
const user = new User();
import { message } from "@/utils/message";
import { useI18n } from "vue-i18n";

const props = defineProps(["operateType", "formValue"]);
const emits = defineEmits(["operateBack"]);
let dialogVisible = ref(true);
const dialogTitle = ref("从AD添加用户"); 

let form = ref({
  userName: '',
  fullName: "",
  gender: "",
  department: "",
  email: "",
  report: "",
  jobTitle:'',
  isAdmin: false,
  startWorkDate: "",
  ehiStratWorkDate: "",
  cc: '', 
  ccHours:0,
  createBy: '',
  modifyBy: ''
}); 
 
let formLabelWidth = ref("110px");
 

let genders = ref([
  {
    value: 1,
    label: "男",
  },
  {
    value: 2,
    label: "女",
  },
]);

const getADinfo=()=>{ 
  let data={ userName:form.value.userName}

  user.getADInfo(data).then(res=>{
    // console.log(res.result)
    if(res.code=="000"){
      // res.result.ehiStratWorkDate=new Date(res.result.ehiStratWorkDate)
      // console.log(res.result.ehiStratWorkDate)
      res.result.ccHours=0;
      form.value=res.result;
    }else{
      message.error("AD域找不到该用户")
    }
  })
}

const cancel = () => { };

const add = () => { 
  form.value.createBy='';
  form.value.modifyBy=''; 
  let postJson=JSON.stringify(form.value) 
   user.add(postJson).then(res=>{
    if(res.code=="000"){
      message.success("添加成功")
      dialogVisible.value=false;
      emits('operateBack',true)
    }
   })

  // form.value.parentID="94d26bc1-c2ca-425a-9c30-f3807f0ca523";

  // let postJson=JSON.stringify(form.value)
  // console.log(postJson)

  //  AddMenu(postJson).then(res=>{
  //   if(res.code=="000"){
  //     message.success("添加成功")
  //     dialogVisible.value=false;
  //     emits('operateBack',true)
  //   }
  //  })

};

const update = () => {
  // form.value.parentID="94d26bc1-c2ca-425a-9c30-f3807f0ca523";
  let postJson = JSON.stringify(form.value)
  console.log(postJson)
  user.update(postJson).then(res => {
    if (res.code == "000") {
      message.success("操作成功")
      dialogVisible.value = false;
      emits('operateBack', true)
    }
  })
};



</script>

<style scoped>
.dialog-footer {
  float: right;
}
</style>
