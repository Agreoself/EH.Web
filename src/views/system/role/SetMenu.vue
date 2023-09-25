<template>
    <el-dialog width="45%" top="5vh" title="权限分配" v-model="setMenuDialog" center draggable>
        <el-tree 
        ref="menuTree" 
        show-checkbox 
        node-key="id"
        :data="menuAllList" 
        :default-expanded-keys="[]" 
        :default-checked-keys="[]" 
        :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel" >取 消</el-button>
            <el-button type="primary" @click="grantPermission" >确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script setup>
import {GetAllMenus} from '@/api/menu'
const emits =defineEmits(["operateBack"]);
const setMenuDialog=ref(true);
let menuTree=ref();

const menuAllList=ref([]);
let  defaultProps= {children: 'children',label: 'menuName'}

onMounted(()=>{
    GetAllMenus().then(res=>{
        menuAllList.value=res.result;
        console.log(menuAllList.value)
    })
    
})

const grantPermission=()=>{
     let ss=menuTree.value.getCheckedKeys();
     console.log(ss) 
    console.log(menuTree)
}

const cancel=()=>{

}
</script>

<style lang="scss" scoped></style>