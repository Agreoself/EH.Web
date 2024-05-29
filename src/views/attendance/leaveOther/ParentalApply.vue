<template>
  <el-dialog v-model="dialogVisible" :key="dialogKey" :title="title" width="55%" draggable center top="5vh">
    <el-form ref="applyForm" :model="form" label-width="150px" label-position="right" :rules="rules" :disabled="isRead">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('申请单号')" prop="requestID">
            <el-input v-model="form.requestID" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('申请人')" prop="userId">
            <el-input v-model="form.userId" readonly />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
         <el-col :span="12">
          <el-form-item :label="$t('孩子出生日期')" prop="bornDate">
            <el-date-picker v-model="form.bornDate" type="date" style="width:100%" date-format="YYYY MM DD" value-format="YYYY-MM-DD"/>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('描述')" prop="description">
            <el-input type="textarea" v-model="form.description" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="props.action != 'apply'">
        <el-col :span="24">
          <el-form-item :label="$t('附件')" prop="attachment">
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

    <el-input v-if="auditShowBtn" style="padding-left: 28px;" v-model="form.comment" placeholder="Please Input your Comments" />

    <template #footer>
      <!-- <el-button @click="submit('save')" type='primary' v-show="!isRead" >仅保存</el-button> -->
      <el-button @click="submit('process')" type='success' v-show="!isRead&&!noshowbutton" >{{t('提交审批')}}</el-button>
      <el-button @click="submit('agree')" type='success' v-show="isRead&&!noshowbutton">{{t('同意')}}</el-button>
      <el-button @click="submit('deny')" type='danger' v-show="isRead&&!noshowbutton">{{t('驳回')}}</el-button>
      <el-button @click="cancel" v-if="!noshowbutton">{{t('取消')}}</el-button>
    </template>
  
    <div v-if="isPreview" class="demo-image__preview">
      <el-image-viewer :zoom-rate="1.2" :initial-index="viewerIndex" :url-list="previewSrcList"
        :close-on-press-escape="false" @close="ClosePreviewer" />
    </div>
  </el-dialog>
</template>
 
<script setup>
import storage from "@/utils/storage"
import allDic from "@/utils/dictionary";
import { page } from '@/utils/pageinfo'; 
import { message } from "@/utils/message" 
import { useI18n } from "vue-i18n";
const {t} =useI18n();
import { OtherRelated } from "@/api/attendance/otherRelated"
const otherRelated = new OtherRelated(); 

const dialogVisible = ref(true);
let dialogKey = ref(0);

let props = defineProps(["formValue", "action"]);
const emits = defineEmits(["applyBack"]);
let form = toRef(props.formValue);
form.value.comment="";
// console.log(form.value)

let applyForm = ref();
let title = ref(props.action == 'audit' ? t("操作") :props.action == 'read'?t("详情"): t("申请"));
const isRead = ref((props.action == 'audit'||props.action == 'read') ? true : false);
const noshowbutton = ref(props.action == 'read' ? true : false);
let auditShowBtn=ref((props.action == 'audit') ? true : false)
 
let rules = reactive({
  userId: [{ required: true, message: `用户名称不能为空`, trigger: 'blur' }],
  requestID: [{ required: true, message: `申请单号不能为空`, trigger: 'blur' }],
  attachment: [{ required: true, message: `附件不能为空`, trigger: 'blur' }],
  bornDate: [{ required: true, message: `出生时间不能为空`, trigger: 'blur' }],
})
 
onMounted(async () => {

  
  previewSrcList.value=editFileList.value.map(i=>i.url);
})
  
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
  applyForm.value.validate((valid) => {
    if (valid) {
      form.value.createBy = '';
      form.value.modifyBy = ''; 
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
          otherRelated.add(postJson).then(res => {
            apiCallBack(res);
          })
        }  else if (audit == 'save') {
          form.value.currentState = '-1';
          let postJson = JSON.stringify(form.value) 
          otherRelated.save(postJson).then(res => {
            apiCallBack(res);
          })
        }
      } 
      else if (props.action == 'audit') {
        audit == "deny" ? form.value.currentState = 3 : form.value.currentState = 2;
        otherRelated.update(form.value).then(res => {
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

  

watch(fileList, async (n, o) => {
  // console.log(n)
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
 
</style>