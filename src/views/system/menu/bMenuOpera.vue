<template>
  <!-- <el-dialog width="35%" :title="dialogTitle" v-model="dialogVisible" center draggable> -->
  <el-drawer v-model="dialogVisible" :title="dialogTitle" direction="rtl" size="30%">
    <el-form :model="form" style="padding: 0px 20px" size="default">
      <el-form-item label="菜单类型" v-if="props.operateType == 'add'" :label-width="formLabelWidth">
        <el-select v-model="form.menuType" @change="selectMenuType" placeholder="请选择" style="width: 100%;">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级菜单" :label-width="formLabelWidth">
        <el-cascader style="width: 100%;" size="default" placeholder="请选择" :props="defaultParams" v-model="form.parentID"
          :options="parentMenuList">
        </el-cascader>
      </el-form-item>

      <el-form-item label="菜单名称" :label-width="formLabelWidth">
        <el-input v-model="form.menuName" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="路由路径"  :label-width="formLabelWidth">
        <el-input v-model="form.routePath" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="路由名" :label-width="formLabelWidth">
        <el-input v-model="form.routeName" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="组件" v-if="form.menuType === 1" :label-width="formLabelWidth">
        <el-input v-model="form.component" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="权限标识" :label-width="formLabelWidth">
        <el-input v-model="form.permissions" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="icon"  :label-width="formLabelWidth">
        <el-input v-model="form.icon" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="排序"  :label-width="formLabelWidth">
        <el-input-number v-model="form.sort" :min="0" :max="10" label="描述文字"></el-input-number>
      </el-form-item>

      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="form.remark">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">cancel</el-button>
        <el-button type="primary" @click="props.operateType === 'add' ? addMenu() : updateMenu()">confirm</el-button>
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
    </div> -->
  <!-- </el-dialog> -->
</template>

<script setup>
import { AddMenu, GetParentMenuList, UpdateMenu } from "@/api/menu";
import { message } from "@/utils/message";
import { page } from '@/utils/pageinfo'
import Form from '@/components/form'

const props = defineProps(["operateType", "formValue", "parentMenuList"]);
const emits = defineEmits(["operateBack"]);
let dialogVisible = ref(true);
const dialogTitle = ref(props.operateType == "add" ? "添加菜单" : "编辑菜单");

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

let form = ref(props.formValue);
let defaultParams = ref({ label: "menuName", value: "id", checkStrictly: true, emitPath: false });
let parentMenuList = ref([]);

let formLabelWidth = ref("80px");

let options = ref([
  {
    value: 0,
    label: "目录",
  },
  {
    value: 1,
    label: "组件",
  },
]);

const cancel = () => { };

const addMenu = () => {

  // let length=form.value.parentID.length; 
  // let parentID=form.value.parentID[length-1];

  // form.value.parentID=parentID;

  let postJson = JSON.stringify(form.value)
  console.log(postJson)

  AddMenu(postJson).then(res => {
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
  UpdateMenu(postJson).then(res => {
    if (res.code == "000") {
      message.success("操作成功")
      dialogVisible.value = false;
      emits('operateBack', true)
    }
  })

};
const selectMenuType = () => {
  if (form.menuType == 0) {
    GetParentMenuList().then((res) => {
      if (res.code == "000") {
        console.log(res.result);
        parentMenuList.value = res.result;
        parentMenuList.value.push({ "menuName": "根目录", id: null });
      }
    });
  }
};

onMounted(() => {
  GetParentMenuList().then((res) => {
    if (res.code == "000") {
      console.log(res.result);
      parentMenuList.value = res.result;
      parentMenuList.value.push({ "menuName": "根目录", id: null });
    }
  });
})


</script>

<style scoped>
.dialog-footer {
  float: right;
}
</style>
