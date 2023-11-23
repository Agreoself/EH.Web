<template>
    <el-dialog v-model="dialogVisible" :key="dialogKey" title="分配角色" width="40%" draggable center>
        <el-checkbox-group v-model="checkRole">
            <el-checkbox v-for="role in roleList" :label="role.id"  border>{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
       
        <template #footer> 
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="setUser">确认</el-button>
       
        </template>
    </el-dialog>
</template>

<script setup>
import { Role } from "@/api/system/role";
const role = new Role();
import { User } from "@/api/system/user";
const user = new User();
import { message } from "@/utils/message";
let props = defineProps(["userId"]);
let emits = defineEmits(["setRoleBack"]);

let roleList = ref([]);
let dialogVisible = ref(true);
let dialogKey = ref(0);
let setUserParams = ref({ userIds: props.userId, roleIds: [] });
 
let checkRole = ref([]);

onMounted(() => {
    role.getAllRole().then(res => {
        if (res.code == "000") {
            roleList.value = res.result;
        }
    });

    let json = { userId: props.userId[0] };
    role.getRoleByUser(json).then(res => {
        if (res.code == "000") {
            checkRole.value = res.result.map(i=>i.id);
        }
    })
})

let setUser = () => {
    setUserParams.value.roleIds=checkRole.value;
    let postJson=JSON.stringify(setUserParams.value);
    user.setRole(postJson).then(res=>{
    if(res.code=="000"){
      message.success("success");
      emits("setRoleBack",true)
      dialogVisible.value=false;
    }
    else
    {
      message.error(res.message);
      emits("setRoleBack",false);
      dialogVisible.value=false;
    }
  })
}
 

</script>

<style lang="scss" scoped></style>