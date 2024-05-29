<template>
  <!-- <el-dialog width="35%" :title="dialogTitle" v-model="dialogVisible" center draggable> -->
    <el-drawer
    v-model="dialogVisible"
    :title="dialogTitle"
    direction="rtl"
    size="30%"
  >
    <el-form :model="form" style="padding: 0px 20px" size="default"> 

      <el-form-item :label="t('用户名称')" :label-width="formLabelWidth">
        <el-input v-model="form.userName" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item :label="t('性别')"  :label-width="formLabelWidth">
      <el-select v-model="form.gender" class="m-2" placeholder="Select" style="width:100%">
    <el-option
      v-for="item in genders"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
      </el-select>
      </el-form-item> 
      <el-form-item :label="t('部门')" :label-width="formLabelWidth">
        <el-input v-model="form.department" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item :label="t('上级')" :label-width="formLabelWidth">
        <el-input v-model="form.report" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item :label="t('最终上级')" :label-width="formLabelWidth">
        <el-input v-model="form.lastReport" autocomplete="off"></el-input>
        <!-- <el-radio-group v-model="form.isAdmin" class="ml-4">
      <el-radio :label="true" >管理员</el-radio>
      <el-radio :label="false" >普通用户</el-radio>
    </el-radio-group> -->

      </el-form-item>
      <el-form-item :label="t('开始工作时间')" :label-width="formLabelWidth">
        <el-date-picker
        v-model="form.startWorkDate"
        type="datetime"
        placeholder="Select date and time"
        style="width: 100%;"
      />
      </el-form-item> 
      <el-form-item :label="t('抄送')" :label-width="formLabelWidth">
        <el-input v-model="form.cc" autocomplete="off"></el-input> 
      </el-form-item>

      <el-form-item :label="t('抄送时长')" :label-width="formLabelWidth">
            <el-input v-model="form.ccHours" autocomplete="off"></el-input>
          </el-form-item>
    </el-form>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">cancel</el-button>
        <el-button type="primary" @click="props.operateType === 'add' ? add() : update()">confirm</el-button>
      </div>
    </template>
    </el-drawer>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button
        type="primary"
        @click="props.operateType === 'add' ? addMenu() : updateMenu()"
        size="small"
        >确 定
      </el-button>
    </div>
  </el-dialog> -->
</template>

<script setup>
const {t}=useI18n();
import { User } from "@/api/system/user";
const user=new User();
import { message } from "@/utils/message";
import { useI18n } from "vue-i18n";

const props=defineProps(["operateType","formValue"]);
const emits =defineEmits(["operateBack"]);
let dialogVisible = ref(true);
const dialogTitle = ref(props.operateType=="add"?"添加用户":"编辑用户");

// let form = ref({
//   menuType: 0,
//   parentID: "",
//   menuName: "",
//   routePath: "",
//   routeName: "",
//   component: "",
//   permissions: "",
//   icon: "",
//   sort: 0,
//   remark: "",
// });

let form=ref(props.formValue);
let defaultParams = ref({ label: "menuName", value: "ID" });
 

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


let admins = ref([
  {
    value: 0,
    label: "管理员",
  },
  {
    value: 1,
    label: "普通用户",
  },
]);

const cancel = () => {};

const add = () => {

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
  let postJson=JSON.stringify(form.value)
  console.log(postJson)
  user.update(postJson).then(res=>{
    if(res.code=="000"){
      message.success("操作成功")
      dialogVisible.value=false;
      emits('operateBack',true)
    }
   }) 
}; 



</script>

<style scoped>
.dialog-footer{
  float:right; 
}
</style>
