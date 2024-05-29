<template>
    <el-row :gutter="20" v-if="!isNormal()">
        <el-col :span="5" style="margin:0px 15px; padding:5px 0px 0px 0px;">
            <el-form-item :label="$t('用户名称')" prop="userName" size="small">
                <el-input v-model="userName" />
            </el-form-item>
        </el-col>
        <el-col :span="5" style="margin:0px 10px; padding:5px 0px 0px 0px;">
            <el-form-item :label="$t('部门')" prop="userName" size="small">
                <el-input v-model="department" />
            </el-form-item>
        </el-col>
        <!-- <el-col :span="4" style="margin:0px 10px; padding:5px 0px 0px 0px;">
            <el-form-item :label="$t('截止日期（年）')" prop="carryoverYear" size="small">
                <el-input v-model="carryoverYear" />
            </el-form-item>
        </el-col> -->
        <el-col :span="5" style="margin-left: 10px; padding:5px 0px 0px 0px;">
            <el-button type="primary" size="small" @click="GetData()">query</el-button>
        </el-col>
    </el-row>

    <el-row>
        <!-- <el-card shadow="always"> -->
            <Table ref="qTable" :tableInfo="tableInfo" @CallTable="OnTable" />
        <!-- </el-card> -->
    </el-row>

</template>

<script setup>
import Table from '@/components/table/index.vue' 
import { message } from '@/utils/message'
import { page } from '@/utils/pageinfo'
import { LeaveManage } from "@/api/attendance/leaveManage"
const leaveManage = new LeaveManage();
import storage from "@/utils/storage"
import { useI18n } from 'vue-i18n';
const {t}=useI18n();

let qTable=ref(); 
let userName=ref("");
let department=ref(""); 
let carryoverYear=ref(new Date().getFullYear()); 
let annualCarryover=carryoverYear.value-1+ t("延期年假")+" "+"("+"deadline 9/30/"+carryoverYear.value +")";
let annualCarryoverused=carryoverYear.value-1+ t("延期年假剩余");

const isNormal=()=>{
    let currentRole=storage.get('currentRole');
    const userRole=storage.get('userInfo').roleList;
    return userRole["普通用户"]==currentRole;
}
const isHr=()=>{
    let currentRole=storage.get('currentRole');
    const userRole=storage.get('userInfo').roleList;
    return userRole["HR"]==currentRole||userRole["超级管理员"]==currentRole
}

let tableColumn = [
  { prop: "userName", label: "用户名称", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'nostring' }
  , { prop: "department", label: "部门", sort: false, order: '', filterValue: '', width: 110, scope: false, type: 'nostring' }
  , { prop: "annualTotal", label: "年假总数", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'nostring' }
  , { prop: "annualAvailable", label: "年假可用(含延期年假)", sort: false, order: '', filterValue: '', width: 275, scope: false, type: 'nostring' }
  , { prop: "annualUsed", label: "已用年假", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'nostring' }
  , { prop: "annualLocked", label: "待批年假", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'nostring' }
  , { prop: "annualCarryover", label:annualCarryover, sort: false, order: '', filterValue: '', width: 285, scope: false, type: 'nostring' }
  , { prop: "annualCarryoverUsed", label:annualCarryoverused, sort: false, order: '', filterValue: '', width: 220, scope: false, type: 'nostring' }
  , { prop: "sick", label: "病假", sort: false, order: '', filterValue: '', width: 120, scope: false, type: 'nostring' }
  , { prop: "personal", label: "事假", sort: false, order: '', filterValue: '', width: 130, scope: false, type: 'nostring' }
  , { prop: "marriage", label: "婚假", sort: false, order: '', filterValue: '', width: 130, scope: false, type: 'nostring',}
  , { prop: "paternity", label: "陪产假", sort: false, order: '', filterValue: '', width: 130, scope: false, type: 'nostring' }
  , { prop: "parental", label: "育儿假", sort: false, order: '', filterValue: '', width: 130, scope: false, type: 'nostring' }
  , { prop: "nursing", label: "哺乳假", sort: false, order: '', filterValue: '', width: 130, scope: false, type: 'nostring' }
  , { prop: "prenatalCheckup", label: "产检假", sort: false, order: '', filterValue: '', width: 220, scope: false, type: 'nostring' }
  , { prop: "abortion", label: "流产假", sort: false, order: '', filterValue: '', width: 130, scope: false, type: 'nostring',}
  , { prop: "bereavement", label: "丧假", sort: false, order: '', filterValue: '', width: 160, scope: false, type: 'nostring' }
  , { prop: "maternity", label: "产假", sort: false, order: '', filterValue: '', width: 160, scope: false, type: 'nostring' }

  // , { prop: "isTreated", label: "是否结算", sort: false, order: '', filterValue: '', width: 90, scope: true, type: 'int' }

];
let upFix=isNormal()?-2:47;
let table = toRef(page.tableInfo.createNew(upFix));
table.value.tableColumn = tableColumn;

let tableInfo = table;
 


let GetData = () => { 
    // annualCarryover.value=carryoverYear.value-1+ "延期年假 "+"("+"9/30/"+carryoverYear.value +" empty)";
    // annualCarryoverused.value=carryoverYear.value-1+ "延期年假已用";
    // console.log(annualCarryover.value)
    // console.log(annualCarryoverused.value)
    qTable.value.Expose("openLoading");
    table.value.pageRequest.where=userName.value+"&"+department.value+"&"+isNormal();
    table.value.pageRequest.defaultWhere = `userId=${storage.get('userInfo').userName},isHR=${isHr()}`
    let postJson = table.value.pageRequest;
    leaveManage.statistics(postJson).then(res => {
        qTable.value.Expose("closeLoading")
        table.value.tableData = res.result;
        table.value.total = res.other;
    })
}

onMounted(()=>{
    GetData();
})

const OnTable = (data) => {

if (data.needRefresh) {
  GetData();
} 
}

</script>

<style lang="scss" scoped>

</style>