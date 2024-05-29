<template>
  <el-dialog v-model="dialogVisible" :key="dialogKey" :title="title" width="55%" draggable center top="5vh"
    :before-close="handleClose">
    <el-form ref="applyForm" :model="form" label-width="110px" label-position="right" :rules="rules" :disabled="isRead">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('请假单号')" prop="leaveId">
            <el-input v-model="form.leaveId" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('请假人')">
            <el-input v-model="form.userFullName" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="isRead?12: 9">
          <el-form-item :label="$t('请假类型')" prop="leaveType">
            <el-select v-model="form.leaveType" style="width:100%" @change="LeaveTypeChange">
              <el-option v-for="option in leaveTypes" :key="option.value" :value="option.value"
                :label="t(option.label)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="isRead?12: 9" v-if="!isNursingAva">
          <el-form-item :label="$t('请假类型')" prop="leaveType">
            <el-select v-model="form.leaveType" style="width:100%" @change="LeaveTypeChange">
              <el-option v-for="option in leaveTypes" :key="option.value" :value="option.value" :label="t(option.label)">
              </el-option>
            </el-select>
          </el-form-item> 
        </el-col> -->
        <el-col v-if="(jsav&&!isRead)" :span="15">
          <span class="useSpan" v-html="availableTips"></span>
          <el-tooltip class="box-item" effect="dark" placement="right">
            <span>
              <InfoFilled class="info" />
            </span>
            <template #content>
              <span v-html="infoTips"></span>
            </template>
          </el-tooltip>

          <el-button @click="showInfo" style="margin-left: 10px;" class="m-2" v-if="isAnnual">Annual leave calculation
            rules</el-button>
        </el-col>
      </el-row>

      <el-row>
        <!-- <el-col :span="18">
          <el-form-item :label="$t('请假时间')" prop="leaveTime">
            <el-date-picker v-model="form.leaveTime" style="width:100%" range-separator="To" type="datetimerange"
              start-placeholder="Start Date" end-placeholder="End Date" :default-time="defaultTime"
              value-format="YYYY-MM-DDTHH:mm" :unlink-panels="true" @change="LeaveTimeChange" :editable="false"  />
          </el-form-item>
        </el-col>
        <el-col  :span="6">
          <span class="useSpan" v-html="totalHourTips"></span>
        </el-col> -->

        <el-col :span="9">
          <el-form-item :label="t('请假开始时间')" prop="startDate">
            <el-date-picker v-model="form.startDate" type="datetime" style="width:100%" @change="LeaveTimeChange"
              format="YYYY-MM-DD HH:mm" date-format="YYYY MM DD" time-format="HH:mm" value-format="YYYY-MM-DDTHH:mm"
              :default-time="defaultTime[0]" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item :label="t('请假结束时间')" prop="endDate">
            <el-date-picker v-model="form.endDate" type="datetime" style="width:100%" @change="LeaveTimeChange"
              format="YYYY-MM-DD HH:mm" date-format="YYYY MM DD" time-format="HH:mm" value-format="YYYY-MM-DDTHH:mm"
              :default-time="defaultTime[1]" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <span class="useSpan" v-html="totalHourTips"></span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('请假原因')" prop="reason">
            <el-input type="textarea" v-model="form.reason" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="props.action != 'apply'">
        <el-col :span="24">
          <el-form-item :label="$t('附件')" prop="attachment">
            <el-upload v-model:file-list="editFileList" action="#" list-type="picture-card" :auto-upload="false"
              :multiple="true" :limit="3" :on-change="filesChanged" accept="image/png, image/jpeg">
              <el-icon v-if="!isRead">
                <Plus />
              </el-icon>

              <template #file="{ file }">
                <div>
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="PictureView(file)">
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span v-if="!isRead" class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>

              <template #tip>
                <div class="el-upload__tip">jpg/png files with a count less than 3</div>
              </template>

            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="props.action == 'apply'">
        <el-col :span="24">
          <el-form-item :label="$t('选择附件')" prop="attachment">
            <el-upload v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false"
              :multiple="true" :limit="3" :on-change="filesChanged" accept="image/png, image/jpeg">
              <el-icon>
                <Plus />
              </el-icon>
              <template #file="{ file }">
                <div>
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="PictureView(file)">
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span v-if="!isRead" class="el-upload-list__item-delete" @click="handleRemove(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </span>
                  </span>
                </div>
              </template>
              <template #tip>
                <div class="el-upload__tip">jpg/png files with a count less than 3</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-input v-if="auditShowBtn" style="padding-left: 28px;" v-model="form.comment"
      placeholder="Please Input your Comments" />

    <template #footer>
      <el-button @click="submit('save')" type='primary' v-show="!auditShowBtn&&!readNoButton"
        :loading="btnLoading">{{t('仅保存')}}</el-button>
      <el-button @click="submit('process')" type='success' v-show="!auditShowBtn&&!readNoButton"
        :loading="btnLoading">{{t('提交')}}</el-button>
      <el-button @click="submit('agree')" type='success' v-show="auditShowBtn&&!readNoButton"
        :loading="btnLoading">{{t('同意')}}</el-button>
      <el-button @click="submit('deny')" type='danger' v-show="auditShowBtn&&!readNoButton"
        :loading="btnLoading">{{t('驳回')}}</el-button>
      <el-button @click="cancel" v-if="!readNoButton">{{t('取消')}}</el-button>
    </template>

    <div v-if="isPreview" class="demo-image__preview">
      <el-image-viewer :zoom-rate="1.2" :initial-index="viewerIndex" :url-list="previewSrcList"
        :close-on-press-escape="false" @close="ClosePreviewer" />
    </div>
  </el-dialog>
  <el-dialog v-model="infoDialog" :key="infoDialogKey" width="30%" draggable center @close="calcuteClose" top="5vh">
    <el-date-picker v-model="infoDate" style="width:100%" range-separator="To" type="daterange"
      start-placeholder="Start Date" end-placeholder="End Date" value-format="YYYY-MM-DD" :unlink-panels="true"
      @change="infoTimeChange" :editable="false" />
    <span v-html="annualTips"></span>
  </el-dialog>
</template>
 
<script setup>
import storage from "@/utils/storage"
import allDic from "@/utils/dictionary"; 
import { message } from "@/utils/message"
import { CalculateTotalHours,calculateLeaveHours } from "@/utils/dateformat"
import { useI18n } from "vue-i18n";
const {t} =useI18n();
const user=storage.get('userInfo');
import { LeaveSetting } from "@/api/attendance/leaveSetting"
const leaveSetting = new LeaveSetting();
import { LeaveForm } from "@/api/attendance/leaveForm"
const leaveForm = new LeaveForm();
import { LeaveManage } from "@/api/attendance/leaveManage"
const leaveManage = new LeaveManage();
import { User } from "@/api/system/user"
const userApi = new User();

let props = defineProps(["formValue", "action"]);
const emits = defineEmits(["applyBack"]);

const handleClose = () => {
  if (props.action == 'apply') {
    const func = () => {
      dialogVisible.value = false
    }
    message.confirm('Are you sure to close this Application?', func)
  }
  else
  {
    dialogVisible.value = false
  }
}
const dialogVisible = ref(true);
let dialogKey = ref(0); 
let form = toRef(props.formValue); 
form.value.comment = "";

let applyForm = ref();
let btnLoading=ref(false);
let title = ref(props.action == 'audit' ? t("操作") :props.action == 'read'?t("详情"): t("申请"));
const isRead = ref((props.action == 'audit'||props.action == 'read') ? true : false);
let auditShowBtn=ref((props.action == 'audit') ? true : false)
let readNoButton=ref(props.action == 'read' ? true : false);
 
let leaveTypes = ref(allDic.leaveType);

let split='--------------------------------------------------------------------'

const getAvailableDayAndHours=(data)=>{
  let day = Number.parseInt( data / 8);
  let hour = data % 8;
  return `(<span style="font-weight: bold; color: red;">${day}</span>day<span style="font-weight: bold; color: red;">${hour}</span>h)`
}
 
let jsav = ref(false);
let currentLeaveType = ref();
let availableHour = ref(0);
let totalHour = ref(0);
let availableTips=ref(t('可用')+'&nbsp'+' 0 h');
let totalHourTips=ref(t('总共')+'&nbsp'+`<span style="font-weight: bold; color: red;">${totalHour.value}</span>`+'&nbsp'+'h'+`${getAvailableDayAndHours(totalHour.value)}`);
let isNursingAva = ref(false);

let infoTips=ref('');
let isAnnual=ref(false);
const infoDialog = ref(false);
let infoDialogKey = ref(0);
let currentYear=new Date().getFullYear();
let startDate=`${currentYear}`+'-01-01';
let endDate=`${currentYear}`+'-12-31';
let infoDate=ref([startDate, endDate]); 
let annualTips=ref(''); 
const showInfo=()=>{
  infoDialog.value=true;
  infoDialogKey.value=Math.random();
  annualTips.value=(user.fullName+':'+'<br/>'+'Work Start Date:'+user.startWorkDate.split('T')[0]+'<br/>'+'ehc Start Date:'+user.ehiStratWorkDate.split('T')[0]+'<br/>');
  getInfo();
}
const infoTimeChange = () => {
  if (infoDate.value != null) {
    console.log(infoDate.value)
    let startDate = infoDate.value[0];
    let endDate =infoDate.value[1]; 
    annualTips.value=(user.fullName+':'+'<br/>'+'Work Start Date:'+user.startWorkDate.split('T')[0]+'<br/>'+'ehc Start Date:'+user.ehiStratWorkDate.split('T')[0]+'<br/>');
    getInfo(startDate,endDate);
  }
} 
let GetVacationInfo=(datas)=>{
  let info='';
  let total=0.0;
  info+='<br/>'+'from '+infoDate.value[0]+' '+ 'to '+infoDate.value[1]+' annual vacation hours:'
  info+='<br/>'+split+'<br/>';
  datas.forEach(data => {
  info+=data.start +'===>'+data.end+'<br/>';
  info+='days count = '+data.day+'<br/>';
  info+='accumulated working years ' +'= '+data.workYear+'<br/>';
  info+='ehc working years' +'= '+data.ehiYear+'<br/>';
  info+='vacation standard ' +'= '+data.standard+'<br/>';
  info+='hours '+'= '+`${data.standard}`+` * 8 * `+`${data.day}`+' / 365 ='+`${data.total}`
  info+='<br/>'+split+'<br/>';
  total+=data.total;
  });
  info+='Total:'+Math.floor(total * 2) / 2;+'<br/>'; 
  // info+='<br/>'+split+'<br/>';
  // info+=`Used=${currentLeaveType.used}` 
  return info;
} 
const calcuteClose=()=>{
  infoDate.value=[startDate, endDate]
}
const getInfo = async (startDate,endDate) => {
  let postData = { userId: form.value.userId,startDate:startDate,endDate:endDate };
  await leaveManage.getInfo(postData).then(res => {
    annualTips.value += GetVacationInfo(res.result)
  })
}


let rules = reactive({
  leaveType: [{ required: true, message: t('请假类型')+' '+t(`不能为空`), trigger: 'blur' }],
  leaveId: [{ required: true, message: t('请假单号')+' '+t(`不能为空`), trigger: 'blur' }],
  startDate: [{ required: true, message: t('请假开始时间')+' '+t(`不能为空`), trigger: 'blur' }],
  endDate: [{ required: true, message: t('请假结束时间')+' '+t(`不能为空`), trigger: 'blur' }],
  leaveTime: [{ required: true, message: t('请假时间')+' '+t(`不能为空`), trigger: 'blur' }],
})

const defaultTime = [new Date(2000, 1, 1, 8, 30), new Date(2000, 2, 1, 17, 30),]

onMounted(async () => { 
  let data={userName:form.value.userId};
  await userApi.getUserInfo(data).then((res) => {
    if(res.code=="000"){ 
      form.value.userFullName= res.result.email.split("@")[0].split(".")[0]+' '+res.result.email.split("@")[0].split(".")[1];
    }
  });
  isNursingAva.value=form.value.leaveType=='nursing';
  isAnnual.value=form.value.leaveType=='annual';
  await filterAvailableLeave(); 
  await getLeaveDetail(); 
  if(props.action!='apply'){ 
    getTotalHour(form.value.startDate,form.value.endDate,currentLeaveType.value);
  }
  previewSrcList.value=editFileList.value.map(i=>i.url);
})

const filterAvailableLeave=async ()=>{
  let leaveSettingArr = [];
  let availableLeaveType = [];
  let gender = storage.get('userInfo').gender
  let pageRequest = {
    pageIndex: 1,
    pageSize: 50,
    where: "",
    order: 'createDate',
    defaultWhere: "",
  }
  await leaveSetting.getPageList(pageRequest).then(res => {
    leaveSettingArr = res.result
    availableLeaveType = leaveSettingArr.filter(i => i.qualification == '0' || i.qualification == gender);
    leaveTypes.value = leaveTypes.value.filter(i => availableLeaveType.map(i => i.leaveType).indexOf(i.value) >= 0);
  })
  
}
  
const getLeaveDetail=async ()=>{
  let postJson = { userId: form.value.userId, leaveType: form.value.leaveType }
  await leaveSetting.getLeaveDetail(postJson).then(res => {
    if (res.code == "000") {
      jsav.value = true;
    }else
    {
      jsav.value = true;
    }
    currentLeaveType.value = res.result;
    availableHour.value = res.result.available; 
    if (!isNursingAva.value) {
      availableTips.value = currentLeaveType.value.leaveType == 'sick' ? t('带薪可用') + '&nbsp' : t('可用') + '&nbsp'
      const formattedValue = `<span style="font-weight: bold; color: red;">${res.result.available}</span>&nbsph`;
      availableTips.value += formattedValue;
      availableTips.value += getAvailableDayAndHours(res.result.available);
    }
    else
    {
      availableHour.value = 9999;
      availableTips.value = `<span style="font-weight: bold; "></span>&nbsp`;
     
    }
    

    let minUnit = currentLeaveType.value.minUnit;
    let unit = minUnit == "mHour" ? 0.5 : minUnit == "Hour" ? 1 : minUnit == "mDay" ? 4 : minUnit == "Day" ? 8:res.result.available;
    infoTips.value=`The smallest unit of new application:`+`${unit}h`+`<br/>`;
    infoTips.value+=currentLeaveType.value.isHoliday?'Conservation Day':'Working Day'+'<br/>';
    infoTips.value+='';
  })
}
 
const getTotalHour = (startDate, endDate, currentLeaveType) => {
  // console.log(currentLeaveType)
  let isHoliday = currentLeaveType.isHoliday;
  let holidays = currentLeaveType.holidays;
  let workTime = user.worktime
  let isNursing = currentLeaveType.leaveType == "nursing";
  let totalHours = 0;
 
  // if (isHoliday) {  
  //   // startDate=new Date(startDate);
  //   // startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset()); // 时区补偿
  //   // startDate=startDate.toJSON();

  //   // endDate=new Date(endDate);
  //   // endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset()); // 时区补偿
  //   // endDate=endDate.toJSON();

  //   // totalHours = currentLeaveType.leaveType=="nursing"?(new Date(endDate.split('T')[0]).getTime()-new Date(startDate.split('T')[0]).getTime())/86400000+1:(new Date(endDate.split('T')[0]).getTime()-new Date(startDate.split('T')[0]).getTime())/86400000*8+8; 
  //   // totalHour.value = totalHours; 
  //   // console.log(currentLeaveType.leaveType)
  //   totalHours = CalculateTotalHours(startDate, endDate, holidays);
  //   totalHour.value = totalHours;
  // }
  // else {
  //   totalHours = CalculateTotalHours(startDate, endDate, holidays);
  //   totalHour.value = totalHours;
  // } 


  totalHours = calculateLeaveHours(startDate, endDate, workTime, isHoliday, isNursing, holidays);
  totalHour.value = totalHours;
  totalHourTips.value = t('总共') + '&nbsp' + `<span style="font-weight: bold; color: red;">${totalHour.value}</span>&nbsp h` + `${getAvailableDayAndHours(totalHour.value)}`
}

  
const LeaveTypeChange = async () => {
  // form.value.leaveTime=null;
  form.value.startDate="";
  form.value.endDate="";
  totalHour.value=0 
  totalHourTips.value=t('总共')+'&nbsp'+`<span style="font-weight: bold; color: red;">${totalHour.value}</span>&nbsph`+`${getAvailableDayAndHours(totalHour.value)}`
  isAnnual.value=form.value.leaveType=='annual';
  isNursingAva.value=form.value.leaveType=='nursing';
 
  await getLeaveDetail();

  if(isNursingAva.value){
    let msg="From:Maternity leave end time";
      msg+="<br/>";
      msg+="To:Child’s first birthday"
      //'From:Maternity leave end time To:Child’s first birthday'
      message.alert(msg, "Tips")
  }
 
  let needHr=currentLeaveType.value.needHr;
  if (needHr) {
    rules["attachment"] = [{ required: true, message: t(`附件`)+' '+t('不能为空'), trigger: 'change' }]
  }
  else {
    rules["attachment"] = []
    applyForm.value.clearValidate("attachment");
  }
 
}

const LeaveTimeChange = () => {
  if(form.value.startDate!=null&&form.value.endDate!=null&&form.value.startDate!=""&&form.value.endDate!=""){
    if(form.value.startDate>form.value.endDate){
      message.warning("From must be less than To");
      form.value.startDate="";
      form.value.endDate="";
      totalHour.value=0;
      totalHourTips.value=t('总共')+'&nbsp'+`<span style="font-weight: bold; color: red;">${totalHour.value}</span>&nbsph`+`${getAvailableDayAndHours(totalHour.value)}`
      return
    }
    if (currentLeaveType.value == undefined) {
      message.warning("请先选择请假类型");
      // form.value.leaveTime = null
      form.value.startDate = "";
      form.value.endDate = "";
      form.value.totalHour = 0;
      totalHour.value = 0;
      return;
    }
    else if (currentLeaveType.value.code == -1) {
      message.warning("当前请假类型需要初始化，请联系管理员");
      form.value.startDate = "";
      form.value.endDate = "";
      form.value.totalHour = 0;
      totalHour.value = 0;
      return;
    }
    else { 
      let startDate = form.value.startDate;
      let endDate = form.value.endDate; 
      console.log(currentLeaveType.value)
      getTotalHour(startDate,endDate,currentLeaveType.value);
      if (totalHour.value == 0) {
        message.warning("请假时间有误");
        form.value.startDate = "";
        form.value.endDate = "";
        getTotalHour(startDate, endDate, currentLeaveType.value);
      } 
    }
  }
  else
  { 
    totalHour.value=0;
    totalHourTips.value=t('总共')+'&nbsp'+`<span style="font-weight: bold; color: red;">${totalHour.value}</span>&nbsph`+`${getAvailableDayAndHours(totalHour.value)}`
  }
  // if (form.value.leaveTime != null&&form.value.leaveTime.length>0) {
  //   let startDate = form.value.leaveTime[0];
  //   let endDate = form.value.leaveTime[1];
  //   if (currentLeaveType.value == undefined) {
  //     message.warning("请先选择请假类型");
  //     form.value.leaveTime = null
  //     form.value.totalHour=0;
  //     return;
  //   }
  //   else { 
  //     getTotalHour(startDate,endDate,currentLeaveType.value);
  //   }
  // }
}


let isPreview = ref(false);
let previewSrcList = ref([]);
let viewerIndex = ref(0);

let getImageFromBase64 = (attachment) => {
  let dfList = [];
  let arrayBase64 = attachment.split("|pic|");
  if (arrayBase64[0] != "") {
    arrayBase64.forEach(element => {
      dfList.push({ url: element });
    });
    return dfList;
  }
  else {
    return dfList;
  }

}
let editFileList = toRef(getImageFromBase64(form.value.attachment));
const fileList = ref([]);

const filesChanged = (file) => {
  if (props.action == "edit") {
    editFileList.value.push(file)
    previewSrcList.value.push(file.url)
    if(editFileList.value.length>0){
      applyForm.value.clearValidate("attachment");
    }
  } else {
    fileList.value.push(file);
    previewSrcList.value.push(file.url)
    if(fileList.value.length>0){
      applyForm.value.clearValidate("attachment");
    }
  }
}

const handleRemove = (file) => {
  if (props.action == "edit") {
    editFileList.value = editFileList.value.filter(i => i.uid != file.uid);
    previewSrcList.value = previewSrcList.value.filter(item => item !== file.url);
  }
  else {
    fileList.value = fileList.value.filter(i => i.uid != file.uid);
    previewSrcList.value = previewSrcList.value.filter(item => item !== file.url);
  }
}

const PictureView = (file) => {
  isPreview.value = true;
  if (previewSrcList.value.filter(item => item == file.url).length > 0) {
    viewerIndex.value = previewSrcList.value.findIndex(item => item === file.url);
    return;
  } else {
    // previewSrcList.value.push(file.url);
    viewerIndex.value = previewSrcList.value.findIndex(item => item === file.url);
  }

}

const ClosePreviewer = () => {
  isPreview.value = false
}


const submit = (audit = null) => {
  btnLoading.value=true;
  applyForm.value.validate((valid) => {
    if (valid) {
      form.value.createBy = '';
      form.value.modifyBy = ''; 
      // form.value.startDate = form.value.leaveTime[0];
      // form.value.endDate = form.value.leaveTime[1];
        
      const apiCallBack = (res) => {
        if (res.code == "000") {
          message.success("success");
          dialogVisible.value = false;
          emits('applyBack', true)
        }
        else {
          message.error(res.message);
        }
      }
      
      if (props.action == 'apply') {
       
        let minUnit = currentLeaveType.value.minUnit;
        let unit = minUnit == "mHour" ? 0.5 : minUnit == "Hour" ? 1 : minUnit == "mDay" ? 4 : minUnit == "Day" ? 8 : currentLeaveType.value.available;
        let availableCount = currentLeaveType.value.available;

        if (minUnit == "Day" && (Number.parseFloat(totalHour.value) % Number.parseFloat(unit)) != 0) {
          message.error("请假最小单位为一天");
          btnLoading.value = false;
          return
        }
        
        if (currentLeaveType.value.leaveType != 'sick' && totalHour.value > availableHour.value) {
          message.error("请假时长大于可用额度，无法请假，请修改");
          btnLoading.value = false;
          return
        }

        
        if (minUnit == "All") {
          if (Number.parseFloat(totalHour.value) > Number.parseFloat(availableCount)) {
            message.error("请假时长大于可用额度，无法请假，请修改");
            btnLoading.value = false;
            return
          }
          if(Number.parseFloat(totalHour.value) < Number.parseFloat(availableCount)){
            const func=()=>{
              if (audit == 'process') {
                form.value.cancelState = '0';
                form.value.currentState = '0';
                let postJson = JSON.stringify(form.value)
                leaveForm.add(postJson).then(res => {
                  apiCallBack(res);
                  btnLoading.value = false;
                })
              }
              else if (audit == 'save') {
                form.value.currentState = '-1';
                form.value.cancelState = '-1';
                let postJson = JSON.stringify(form.value);
                leaveForm.save(postJson).then(res => {
                  apiCallBack(res);
                  btnLoading.value = false;
                })
              }
            }
            message.confirm(`请假时长${totalHour.value}h小于一次性假期时长${availableCount}h,确认？`, func);
            btnLoading.value = false;
            return;
          }
        }

        if (audit == 'process') {
          form.value.currentState = '0';
          form.value.cancelState = '0';
          let postJson = JSON.stringify(form.value)
          leaveForm.add(postJson).then(res => {
            apiCallBack(res);
            btnLoading.value = false;
          })
        }
        else if (audit == 'save') {
          form.value.currentState = '-1';
          form.value.cancelState = '-1';
          let postJson = JSON.stringify(form.value);
          leaveForm.save(postJson).then(res => {
            apiCallBack(res);
            btnLoading.value = false;
          })
        }
      }
      else if (props.action == 'edit') {
        if (currentLeaveType.value.leaveType != 'sick' && totalHour.value > availableHour.value) {
          message.error("请假时长大于可用额度，无法请假，请修改");
          btnLoading.value = false;
          return
        }
        form.value.currentState =audit == 'process' ? '0' : '-1';
        form.value.cancelState =form.value.currentState;
        let postJson = JSON.stringify(form.value)
        leaveForm.updateFP(postJson).then(res => {
          apiCallBack(res);
          btnLoading.value = false;
        })
      }
      else if (props.action == 'audit') {
        let json = { processID: form.value.processID, formID: form.value.formID, result: audit, comment: form.value.comment }
        leaveForm.auditForm(json).then(res => {
          apiCallBack(res);
          btnLoading.value = false;
        })
      }
    }
    else {
      message.warning('请查数据准确性');
      btnLoading.value = false;
    }
  })
}

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file.raw); // 将文件转换为Base64字符串
    reader.onload = () => {
      fileResult = reader.result;
    };

    reader.onerror = error => reject(error);

    reader.onloadend = () => {
      resolve(fileResult);
    };
  })
}

function base64toBlob(base64, type = 'application/octet-stream') {
  const bstr = atob(base64);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type });
}


watch(fileList, async (n, o) => {

  let base64s = "";
  for (const file of n) {
    const base64 = await getBase64(file);
    base64s += base64 + "|pic|";
    // form.value.attachment+= base64+"|pic|";
  }
  base64s = base64s.substring(0, base64s.length - 5)
  form.value.attachment = base64s;
  // console.log(form.value)
})

watch(editFileList, async (n, o) => {
  let base64s = "";
  for (const file of n) {
    // console.log(file)
    if (file.url.startsWith('data:')) {
      const base64 = file.url;
      base64s += base64 + "|pic|";
      continue;
    } else {
      const base64 = await getBase64(file);
      base64s += base64 + "|pic|";
    }
    // form.value.attachment+= base64+"|pic|";
  }
  base64s = base64s.substring(0, base64s.length - 5)
  form.value.attachment = base64s;
})


const cancel = () => { dialogVisible.value = false; }

watch(dialogVisible, () => {
  emits('applyBack', true)
})

</script>

<style scoped>
.info{
  width: 15px;
  height: 15px;
  justify-content: center;
  display: inline-flex;
  position: relative;
  vertical-align: middle;
}

.useSpan {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 11px;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: var(--el-transition-box-shadow);
  transform: translate3d(0, 0, 0);
  box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
  --el-input-height: var(--el-component-size);
  position: relative;
  font-size: var(--el-font-size-base);
  display: inline-flex;
  width: var(--el-input-width);
  line-height: var(--el-input-height);
  box-sizing: border-box;
  vertical-align: middle;
}

.button-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  padding-right: 10px;
}
</style>