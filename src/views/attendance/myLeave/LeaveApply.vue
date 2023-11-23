<template>
  <el-dialog v-model="dialogVisible" :key="dialogKey" :title="title" width="55%" draggable center top="5vh">
    <el-form ref="applyForm" :model="form" label-width="110px" label-position="right" :rules="rules" :disabled="isRead">
      <el-row>
        <el-col :span="12">
          <el-form-item label="请假单号" prop="leaveId">
            <el-input v-model="form.leaveId" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假人">
            <el-input v-model="form.userId" readonly />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="请假时间" prop="leaveTime">
            <el-date-picker v-model="form.leaveTime" style="width:100%" range-separator="To" type="datetimerange"
              start-placeholder="Start Date" end-placeholder="End Date" :default-time="defaultTime"
              value-format="YYYY-MM-DDTHH:mm" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="form.startDate" type="datetime" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker v-model="form.endDate" type="datetime" style="width:100%" />
          </el-form-item>
        </el-col> -->
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="请假类型" prop="leaveType">
            <el-select v-model="form.leaveType" style="width:100%" @change="LeaveTypeChange">
              <el-option v-for="option in leaveTypes" :key="option.value" :value="option.value"
                :label="option.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="请假原因" prop="reason">
            <el-input type="textarea" v-model="form.reason" />
          </el-form-item>
        </el-col>
      </el-row>




      <el-row v-if="props.action != 'apply'">
        <el-col :span="24">
          <el-form-item label="附件" prop="attachment">
            <el-upload v-model:file-list="editFileList" action="#" list-type="picture-card" :auto-upload="false"
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

      <el-row v-if="props.action == 'apply'">
        <el-col :span="24">
          <el-form-item label="选择附件" prop="attachment">
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

    <template #footer>
      <el-button @click="submit('save')" type='primary' v-show="!isRead">仅保存</el-button>
      <el-button @click="submit('process')" type='success' v-show="!isRead">提交</el-button>
      <el-button @click="submit('agree')" type='success' v-show="isRead">同意</el-button>

      <!-- <el-popover placement="top" :width="500" trigger="click" v-show="isRead">
      <template #reference>
        <el-button type='success'>同意</el-button>
      </template>
      <el-input type="textarea" v-model="form.reason" placeholder="请输入意见" />
      <el-button type='primary' style="margin-left: 45%;" >确认</el-button>
    </el-popover> -->

      <el-button @click="submit('deny')" type='danger' v-show="isRead">驳回</el-button>
      <el-button @click="cancel">取消</el-button>
    </template>
    <!-- <div class="button-container" v-show="!isRead">
    
    </div> -->
    <div v-if="isPreview" class="demo-image__preview">
      <el-image-viewer :zoom-rate="1.2" :url-list="previewSrcList" :close-on-press-escape="false"
        @close="ClosePreviewer" />
    </div>
  </el-dialog>

  <el-dialog v-model="confimDialog" :key="confimDialogKey" width="30%" draggable center>
    <el-input type="textarea" v-model="form.reason" placeholder="请输入意见" />
    <template #footer>
      <el-button @click="auditConfim" type='primary'>提交</el-button>
    </template>
  </el-dialog>
</template>
 
<script setup>
import storage from "@/utils/storage"
import allDic from "@/utils/dictionary";
import { page } from '@/utils/pageinfo';
import { Delete, Download, Plus, Watch, ZoomIn } from '@element-plus/icons-vue'
import { LeaveSetting } from "@/api/attendance/leaveSetting"
const leaveSetting = new LeaveSetting();
import { LeaveForm } from "@/api/attendance/leaveForm"
const leaveForm = new LeaveForm();
import { message } from "@/utils/message"

let props = defineProps(["formValue", "action"]);
const emits = defineEmits(["applyBack"]);
let form = toRef(props.formValue);
let applyForm = ref();
let title = ref(props.action == 'audit' ? "操作" : "申请")
let leaveTypes=ref(allDic.leaveType);
// console.log(leaveTypes)

const dialogVisible = ref(true);
let dialogKey = ref(0);
const isRead = ref(props.action == 'audit' ? true : false);
// console.log(isRead.value)

const confimDialog = ref(false);
let confimDialogKey = ref(0);

let rules = reactive({
  leaveType: [{ required: true, message: `请假类型不能为空`, trigger: 'blur' }],
  leaveId: [{ required: true, message: `请假单号不能为空`, trigger: 'blur' }],
  leaveTime: [{ required: true, message: `请假时间不能为空`, trigger: 'blur' }],

})

const defaultTime = [
  new Date(2000, 1, 1, 8, 30),
  new Date(2000, 2, 1, 17, 30),
]

onMounted(async ()=>{
  let leaveSettingArr=[];
  let availableLeaveType=[];
  let gender=storage.get('userInfo').gender
  let pageRequest = {
            pageIndex: 1,
            pageSize: 50,
            where: "",
            order: 'createDate',
            defaultWhere:"",
        }
  await leaveSetting.getPageList(pageRequest).then(res=>{
    leaveSettingArr=res.result
    availableLeaveType=leaveSettingArr.filter(i=>i.qualification=='0'||i.qualification==gender);
    leaveTypes.value=leaveTypes.value.filter(i=>availableLeaveType.map(i=>i.leaveType).indexOf(i.value)>=0);
  })
  // console.log(leaveTypes)
})

// let leaveTime=ref([])
// watch(leaveTime,(n,o)=>{
//   if(n!=null){
//     form.value.startDate=formatDate(n[0],"yyyy-MM-dd hh:mm:ss") 
//    form.value.endDate=formatDate(n[1],"yyyy-MM-dd hh:mm:ss") 
//   }
//   else
//   {
//     form.value.startDate=null;
//     form.value.endDate=null;
//   }

//    console.log(form.value)
// })

const LeaveTypeChange = () => {
  if (form.value.leaveType != "annual" && form.value.leaveType != "personal") {
    applyForm.value.clearValidate("attachment");
    rules["attachment"] = [{ required: true, message: `附件不能为空`, trigger: 'blur' }]
  }
  else {
    applyForm.value.clearValidate("attachment");
    rules["attachment"] = [];
  }

  let minUnit = '';
}

let isPreview = ref(false);
let previewSrcList = ref([]);

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
  } else {
    fileList.value.push(file);
  }

}

const handleRemove = (file) => {
  if (props.action == "edit") {
    editFileList.value = editFileList.value.filter(i => i.uid != file.uid);
  }
  else {
    fileList.value = fileList.value.filter(i => i.uid != file.uid);
  }
}

const PictureView = (file) => {
  isPreview.value = true;
  previewSrcList.value.push(file.url);
}

const ClosePreviewer = () => {
  isPreview.value = false
}

const auditConfim = (auditResult) => {

}

const submit = (audit = null) => {
  applyForm.value.validate((valid) => {
    if (valid) {
      form.value.createBy = '';
      form.value.modifyBy = '';
      form.value.startDate = form.value.leaveTime[0];
      form.value.endDate = form.value.leaveTime[1];
      let postJson = JSON.stringify(form.value);

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
        if (audit == 'process') {
          form.value.currentState = '0';
          let postJson = JSON.stringify(form.value)
          leaveForm.add(postJson).then(res => {
            apiCallBack(res);
          })
        }
        else if (audit == 'save') {
          form.value.currentState = '-1';
          let postJson = JSON.stringify(form.value)
          console.log(postJson)
          leaveForm.save(postJson).then(res => {
            apiCallBack(res);
          })
        }
      }
      else if (props.action == 'edit') {
        audit == 'process' ? form.value.currentState = '0' : form.value.currentState = '-1';
        let postJson = JSON.stringify(form.value)
        leaveForm.updateFP(postJson).then(res => {
          apiCallBack(res);
        })
      }
      else if (props.action == 'audit') {
        let json = { processID: form.value.processID, formID: form.value.formID, result: audit }
        leaveForm.auditForm(json).then(res => {
          apiCallBack(res);
        })
      }
    }
    else {
      message.warning('请查数据准确性')
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
  console.log(n)
  let base64s = "";
  for (const file of n) {
    const base64 = await getBase64(file);
    base64s += base64 + "|pic|";
    // form.value.attachment+= base64+"|pic|";
  }
  base64s = base64s.substring(0, base64s.length - 5)
  form.value.attachment = base64s;
  console.log(form.value)
})

watch(editFileList, async (n, o) => {
  let base64s = "";
  for (const file of n) {
    console.log(file)
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


const edit = () => { }
const cancel = () => { dialogVisible.value = false; }

watch(dialogVisible, () => {
  emits('applyBack', true)
})
// const gerenalFormInfo = () => {
//   let fields = [
//     {
//       row: 1,
//       span: 12,
//       require: true,
//       readonly: true,

//       type: 'input',
//       label: '请假单号',
//       prop: 'leaveId',
//       placeholder: '请假单号',
//       defaultValue: serialNum,
//       operateType: ['add'],
//     },
//     {
//       row: 1,
//       span: 12,
//       require: true,
//       readonly: true,

//       type: 'input',
//       label: '请假人',
//       prop: 'userId',
//       placeholder: '请假人',
//       max: 200,
//       defaultValue: userName,
//       operateType: ['add'],
//     },
//     {
//       row: 2,
//       span: 12,
//       require: true,
//       readonly: true,

//       type: 'select',
//       label: '请假类型',
//       prop: 'leaveType',
//       placeholder: '请选择请假类型',
//       defaultValue: '',
//       operateType: ['add', 'update']
//     },

//     {
//       row: 3,
//       span: 12,
//       require: true,
//       readonly: true,

//       type: 'time',
//       label: '开始时间',
//       prop: 'startDate',
//       placeholder: '选择开始时间',
//       defaultValue: '',
//       operateType: ['add', 'update']
//     },
//     {
//       row: 3,
//       span: 12,
//       require: true,
//       readonly: true,

//       type: 'time',
//       label: '结束时间',
//       prop: 'endDate',
//       placeholder: '选择结束时间',
//       defaultValue: '',
//       operateType: ['add', 'update']
//     },
//     {
//       row: 4,
//       span: 12,
//       require: true,
//       readonly: true,

//       type: 'number',
//       label: '总时长',
//       prop: 'totalHours',
//       placeholder: '总时长',
//       defaultValue: 0,
//       operateType: ['add', 'update']
//     },
//     {
//       row: 5,
//       span: 24,
//       require: true,
//       readonly: true,

//       type: 'input',
//       label: '请假原因',
//       prop: 'reason',
//       placeholder: '请输入请假原因',
//       defaultValue: '',
//       operateType: ['add', 'update']
//     },
//     {
//       row: 6,
//       span: 24,
//       require: true,
//       readonly: false,

//       type: 'upload',
//       label: '选择附件',
//       prop: 'attachment',
//       placeholder: '总时长',
//       defaultValue: '',
//       operateType: ['add', 'update']
//     },
//   ];

//   let buttonInfo = [
//     { size: 'default', type: 'primary', icon: 'Plus', click: submit, text: '提交', operateType: ['add'] }
//     , { size: 'default', type: 'primary', icon: 'Edit', click: edit, text: '编辑', operateType: ['update'] }
//     , { size: 'default', type: 'default', icon: 'RefreshLeft', click: cancel, text: '取消', operateType: ['add', 'update'] }
//   ]

//   let formInfo = toRef(page.formInfo.createNew());
//   formInfo.value.fields = fields;
//   formInfo.value.formData = form.value;
//   formInfo.value.hasButton = true;
//   formInfo.value.buttonInfo = buttonInfo;

//   formInfo.value.rules = page.formInfo.createFormRule(fields);
//   formInfo.value.layout = page.formInfo.createFormLayout(fields);
//   return formInfo;
// }

// let formInfo = gerenalFormInfo();
// console.log(formInfo)

</script>

<style scoped>
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