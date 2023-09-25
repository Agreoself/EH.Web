<template>
  <!-- <el-dialog width="35%" :title="dialogTitle" v-model="dialogVisible" center draggable> -->
    <el-drawer
    v-model="dialogVisible"
    :title="dialogTitle"
    direction="rtl"
    size="30%"
  >
    <el-form :model="form" style="padding: 0px 20px" size="default"> 

      <el-form-item label="角色名称" :label-width="formLabelWidth">
        <el-input v-model="form.roleName" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="描述"  :label-width="formLabelWidth">
        <el-input v-model="form.roleDescript" autocomplete="off"></el-input>
      </el-form-item> 
      <el-form-item label="角色key" :label-width="formLabelWidth">
        <el-input v-model="form.roleKey" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth"> 
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
       
    </el-form>
    
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="small">取 消</el-button>
      <el-button
        type="primary"
        @click="props.operateType === 'add' ? add() : update()"
        size="small"
        >确 定
      </el-button>
    </div> -->
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">cancel</el-button>
        <el-button type="primary" @click="props.operateType === 'add' ? add() : update()">confirm</el-button>
      </div>
    </template>
    </el-drawer>
  <!-- </el-dialog> -->
</template>

<script setup> 
import { AddRole,UpdateRole } from "@/api/role";
import { message } from "@/utils/message";

const props=defineProps(["operateType","formValue"]);
const emits =defineEmits(["operateBack"]);
let dialogVisible = ref(true);
const dialogTitle = ref(props.operateType=="add"?"添加角色":"编辑角色");

  
let form=ref(props.formValue);
let defaultParams = ref({ label: "menuName", value: "ID" });
  
let formLabelWidth = ref("80px");
   
const cancel = () => {};

const add = () => { 
   let postJson=JSON.stringify(form.value)
  // console.log(postJson)

  AddRole(postJson).then(res=>{
    if(res.code=="000"){
      message.success("添加成功")
      dialogVisible.value=false;
      emits('operateBack',true)
    }
   })

};

const update = () => { 
  let postJson=JSON.stringify(form.value)
  console.log(postJson)
  UpdateRole(postJson).then(res=>{
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
