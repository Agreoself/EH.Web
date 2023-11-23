<template>
  <NormalPage :pageInfo="pageRenderInfo" @CallPage="OnPage" />

  <LeaveSettingOpera v-if="dialogFormVisible" :key="dialogKey" :operateType="operateType" :formValue="form"
    @operateBack="onMenuOpera" />
</template>

<script setup> 
import { LeaveSetting } from "@/api/attendance/leaveSetting";
const leaveSetting = new LeaveSetting();
import LeaveSettingOpera from './LeaveSettingOpera.vue';
import NormalPage from "@/components/page/normal.vue";
import { message } from '@/utils/message';
import { page } from '@/utils/pageinfo';

let idList = ref([]);
  
let operateType = ref('add');
let dialogKey = ref(0);
let dialogFormVisible = ref(false);
 
let form = ref({});

let tableColumn = [
  { prop: "leaveType", label: "假期类型", sort: false, filterValue: '', width: 120, scope: true, type: 'int' }
  , { prop: "qualification", label: "资格", sort: false, filterValue: '', width: 120, scope: true, type: 'int',   }
  , { prop: "limit", label: "限额", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "minUnit", label: "请假最小单位", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "isContainHoliday", label: "是否含节假日", sort: false, filterValue: '', width: 120, scope: true, type: 'int' }
  , { prop: "calculationRule", label: "计算表达式", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "description", label: "描述", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "createBy", label: "创建人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "createDate", label: "创建时间", sort: false, filterValue: '', width: 120, scope: false, type: 'date' }
  , { prop: "modifyBy", label: "更新人", sort: false, filterValue: '', width: 120, scope: false, type: 'string' }
  , { prop: "modifyDate", label: "更新时间", sort: false, filterValue: '', width: 120, scope: false, type: 'date' }
];

let table = toRef(page.tableInfo.createNew(34));
table.value.tableColumn = tableColumn;


onMounted(() => {
  GetData();
});

const GetData = () => {
  let postJson = JSON.stringify(table.value.pageRequest);
  leaveSetting.getPageList(postJson).then(res => {
    if (res.code == "000") {
      table.value.tableData = res.result;
      table.value.total = res.other; 
    } else {
      message.error(res.message)
    }
  }); 
};

const OnPage = (data) => {
  let components = data.components;
  let componentsData = data.componentsData;
  if (components == 'table') {
    table.value = componentsData.table;
    if (componentsData.needRefresh) {
      GetData();
    }
    idList.value = componentsData.table.selectRow.map(i => i.id);
  }

}

const onMenuOpera = (data) => {
  if (data == true) {
    GetData()
  }
}

const addLeaveSetting = () => {
  operateType.value = 'add';
  form.value = {};
  dialogFormVisible.value = true;
  dialogKey.value = Math.random();
}

const deleteLeaveSetting = () => {
  // console.log(idList.value)
  if (idList.value.length == 0) {
    message.warning("请选择要删除的数据");
  }
  else {
    const func = () => {
      let postJson = JSON.stringify(idList.value)
      leaveSetting.delete(postJson).then(res => {
        if (res.code == "000") {
          message.success("删除成功");
          GetData();
        }
        else {
          message.error(res.message);
        }
      })
    }
    message.confirm('确认删除选中数据？', func)
  }
}

const updateLeaveSetting = () => {
  if (idList.value.length == 0) {
    message.warning("请选择要修改的数据")
  }
  else if (idList.value.length > 1) {
    message.warning("无法修改多条，请单选~")
  }
  else {

    form.value = table.value.selectRow[0]
    console.log(form.value)
    operateType.value = 'update';
    dialogFormVisible.value = true;
    dialogKey.value = Math.random();
  }
}

let buttonInfo = ref([
  { size: 'small', type: 'primary', icon: 'Plus', click: addLeaveSetting, text: '新增' }
  , { size: 'small', type: 'primary', icon: 'Edit', click: updateLeaveSetting, text: '编辑' }
  , { size: 'small', type: 'primary', icon: 'Minus', click: deleteLeaveSetting, text: '删除' }
])

let pageRenderInfo = ref({
  pageTitle: '假期设置',
  hasButton: true,
  hasTable: true,
  hasForm: false,
  buttonInfo: buttonInfo,
  tableInfo: table,
  formInfo: null
})

</script>

<style scoped>
 
</style>
