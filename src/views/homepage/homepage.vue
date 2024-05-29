<template>
  <el-row :gutter="20">
    <el-col :span="20 / headerArr.length" v-for="item in headerArr">
      <el-card class="box-card" style="cursor: pointer;" @click="gotoRoute(Object.keys(item)[0])">
            <h1>{{ t(Object.keys(item)[0]) }}</h1>
            <div>
              <span style=" color: blue;">{{ item[Object.keys(item)[0]] }}</span>
            </div>
          </el-card>
      <!-- <el-skeleton style="width: 100%" :loading="loading" animated>
        <template #template>
          <el-skeleton-item v-for="item in headerArr" variant="image" class="box-card" />
        </template>
        <template #default>
          <el-card class="box-card" style="cursor: pointer;" @click="gotoRoute(Object.keys(item)[0])">
            <h1>{{ t(Object.keys(item)[0]) }}</h1>
            <div>
              <span style=" color: blue;">{{ item[Object.keys(item)[0]] }}</span>
            </div>
          </el-card>
        </template>
      </el-skeleton> -->
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="10">
      <el-card style="text-align: left;">
        <template #header>
          <span v-html="(policyTitle)" @click="openWord">
          </span>
        </template>
        <div :style="dStyle" class=" overflow-y: auto;">
          1.{{ t('三天（不含）以下的休假由部门经理及主管批准，三天（含）以上须部门副总裁批准。') }}<br />
          <br />
          2.{{ t('部门主管、经理及以上人员申请休假须由其上级主管批准。') }}<br />
          <br />
          3.{{
          t('三天（不含）以下的休假须提前一天申请，三天（含）以上十天（不含）以下的须提前七天申请，十天（含）以上的休假须提前一个月申请并须提前一周报备人力资源部。若遇特殊情况，有突发事件无法提前申请，必须在得知突发事件当时先电话与其主管口头请假，并于回公司上班后立即填写正式申请单，获得所须批准签字后报送人力资源部。')
          }}<br />
          <br />
          4.{{ t('请假开始和结束时间请统一按公司规定上班时间（8:30-12:00, 13:00-17:30）填写。') }}<br />
          <br />
          5.{{ t('CS等部门需要上夜班的员工，可以把夜班时间换算成白天时间来填写，而在 Reason 一栏中注明实际的夜班请假时间。') }}<br />
        </div>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-row :gutter="20">
        <el-col :span="24">
          <!-- <el-card :style="e1Style"> -->
          <div :style="e1Style">
            <echarts1 />
          </div>
          <!-- </el-card> -->
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div :style="e1Style">
            <echarts2 />
          </div>
        </el-col>

        <el-col :span="12">
          <div :style="e1Style">
            <echarts3 />
          </div>
        </el-col>

      </el-row>
    </el-col>
  </el-row>

  <el-dialog top="2vh" v-model="dialogDocxValue" width="60%" @close="dialogDocxClose" center>

    <PDF :key="pdfKey" :src="pdfSrc" style="height: 79vh;" />
  </el-dialog>
</template>

<script setup> 
import axios from 'axios'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import echarts1 from './echarts1.vue';
import echarts2 from './echarts2.vue';
import echarts3 from './echarts3.vue';
import { LeaveForm } from '@/api/attendance/leaveForm';
const leaveForm = new LeaveForm();
import { LeaveManage } from '@/api/attendance/leaveManage';
const leaveManage = new LeaveManage();
import storage from "@/utils/storage"  
//预览 
import PDF from "pdf-vue3"; 
 
let dialogDocxValue=ref(false);
let pdfKey=ref(0);
 
const pdfSrc=ref("src/assets/EHC-HR-12-05 假期管理规定.pdf") //设置文档网络地址，可以是相对地址
  
const openWord =async () => {
  // const url = "@/assets/EHC-HR-12-05 假期管理规定.doc";  
  pdfKey.value=Math.random(); 
  dialogDocxValue.value = true;  
}
 
const dialogDocxClose=()=>{
  dialogDocxValue.value=false;
}

 
let userId = storage.get('userInfo').userName
const router = useRouter(); // 第一步
// let mainbodyHeight=650;

let policyTitle=ref('<span style="font-weight: bold; color: blue; cursor:pointer"><span>'+t('EHC-HR-12-05 假期管理规定:'));

let dStyle = ref("height: 420px;");
let e1Style = ref("height: 215px;");
nextTick(() => {
  let mainbodyHeight = document.getElementById('mainbody').clientHeight - 220;
  dStyle.value = `height:${mainbodyHeight}px`
  e1Style.value = `height:${(mainbodyHeight+72 )/ 2}px`
 
})


const gotoRoute = (data) => {
  // console.log(data)
  switch (data) {
    case "我的任务": router.push({ path: '/leaveApprove' }); break;
    case "草稿假单": router.push({ path: '/myLeave', query: { currentState: -1 } }); break;
    case "我的假单": router.push({ path: '/myLeave', query: {  currentState: 0 } }); break;
    case "我的待批假单": router.push({ path: '/myLeave', query: { currentState: '1&0' } }); break;
    case "未通过假单": router.push({ path: '/myLeave', query: { currentState: 3 } }); break;
    default: ;
  } 
}
 
let headerArr = ref([])
onMounted(async () => {
  let currentRole=storage.get('currentRole');
  const userRole=storage.get('userInfo').roleList;
  let isNormal=userRole["普通用户"]==currentRole
  let postData = { userId: userId }
  await leaveForm.getHomePageData(postData).then(res => {
    Object.keys(res.result).forEach(i => {
      let obj = {};
      if(isNormal&&i=="我的任务"){ 
          return; 
      }
      obj[i] = res.result[i]
      headerArr.value.push(obj)
    })
  });  
})
// console.log(headerArr.value)
</script>

<style lang="scss" scoped>
:deep(.docx-wrapper) {
  background-color: #fff;
  padding: 0;
}
:deep(.docx-wrapper > section.docx) {
  width: 100% !important;
  padding: 0rem !important;
  min-height: auto !important;
  box-shadow: none;
  margin-bottom: 0;
} 
.el-col-4 {
    max-width: 20%;
    flex: 0 0 20%;
}
.el-col-5 {
    max-width: 25%;
    flex: 0 0 25%;
}

.el-col-6 {
    max-width: 25%;
    flex: 0 0 25%;
}
.el-card {
  margin-bottom: 20px;
  text-align: center;
}

:-webkit-any(article, aside, nav, section) :-webkit-any(article, aside, nav, section) h1,
h2,
h3 {
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

h1 {
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}


// h1, h2, h3, h4, h5, h6, p, blockquote, pre{
//   margin: 15px !important;
//   padding: 4px !important;
//   border: 10 !important;
// 	font-size: 100% !important;
//   font: inherit !important;
//   vertical-align: baseline !important;
//   box-sizing: border-box !important;
// }
</style>
