<template>
    <el-dialog width="45%" top="5vh" title="权限分配" v-model="setMenuDialog" center draggable>
        <el-tree style="height: 400px;" ref="menuTree" show-checkbox node-key="id" :data="menuAllList" :default-expanded-keys="expandMenu"
            :default-checked-keys="checkMenu" :props="defaultProps" check-strictly>
        </el-tree>
        <template #footer>
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="setMenu">确 定 </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { Menu } from '@/api/system/menu'
const menu = new Menu();

import { Role } from '@/api/system/role'
const role = new Role();

import { message } from "@/utils/message"
let props = defineProps(['roleList']);
let roleList = props.roleList;
const emits = defineEmits(["operateBack"]);
const setMenuDialog = ref(true);
let menuTree = ref();
let checkMenu = ref([]);
let expandMenu = ref([]);

const menuAllList = ref([]);
let defaultProps = { children: 'children', label: 'menuName' }

onMounted(() => {
    menu.GetAllMenus().then(res => {
        menuAllList.value = res.result;
        // console.log(menuAllList.value)
        
    })

    let json = { roleId: roleList[0] }
        menu.GetMenuListByRole(json).then(res => {
            checkMenu.value = res.result.map(i=>i.id);
            expandMenu.value= res.result.filter(i=>i.menuType==0).map(i=>i.id);
        })

 
})

const setMenu = () => {
    let checkMenu = menuTree.value.getCheckedKeys();
    // let checkParentMenu = menuTree.value.getHalfCheckedKeys();
    // let menuList = checkMenu.concat(checkParentMenu);
    // console.log(checkMenu)
    let json = { roleIds: roleList, menuIds: checkMenu }
    let postJson = JSON.stringify(json);
    role.setMenu(postJson).then(res => {
        if (res.code == "000") {
            message.success(res.message);
            setMenuDialog.value = false;
        }
        else {
            message.success(res.message);
        }
    })
}

const cancel = () => {

}
</script>

<style lang="scss" scoped></style>