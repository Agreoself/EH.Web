<template>
  <el-dialog v-model="dialogVisible" :key="dialogKey" width="23%" draggable center>

    <el-upload ref="upload" class="avatar-uploader" action="#" :limit="1" :auto-upload="false" :show-file-list="false"
      :on-change="filesChanged" accept="image/png, image/jpeg" :on-exceed="handleExceed">
      <el-avatar class="avatar" v-if="imageUrl==null||imageUrl==''" shape="square" fit="fill"
        style="background-color: gray;font-size: 1500%;">{{userNameLetter}}</el-avatar>
      <el-avatar class="avatar" v-else :src="imageUrl" shape="square" fit="fill" />
      <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" />
  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->

      <!-- <template #trigger>
    <img :src="imageUrl" alt="Uploaded Image" style="cursor: pointer; max-width: 300px;">
	</template> -->
      <template #tip>
        <div class="el-upload__tip">Click on the image to make changes</div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="reset" :loading="btnLoading">{{ t('初始化图片') }}</el-button>
      <el-button @click="submit" type='primary' :loading="btnLoading">{{ t('提交') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,inject } from 'vue';
import { genFileId } from 'element-plus'
import store from "@/store";
import { message } from "@/utils/message"
const {t}=useI18n();
import { User } from "@/api/system/user";
const user=new User();
  
const reload = inject("reload")

const upload=ref();
let props = defineProps(["userInfo"]);
// const emits = defineEmits(["applyBack"]);
let userInfo=props.userInfo;
const dialogVisible=ref(true);
const dialogKey=ref(0);
let btnLoading=ref(false)
// 初始化图片地址
const imageUrl = ref(props.userInfo.avatar);

let userFullName=userInfo.email.split("@")[0].split(".")[0]+' '+userInfo.email.split("@")[0].split(".")[1];

let getFirstLetter=(userFullName)=>{
    let nameArr= userFullName.split(' ');
    let str="";
    nameArr.forEach(i=>{
        str+=i.charAt(0).toUpperCase()
    })
    return str;
}

let userNameLetter=ref(getFirstLetter(userFullName));


let userJson={avatar:"",userId:props.userInfo.userName,ID:props.userInfo.id}

const reset=()=>{
  imageUrl.value=''; 
}

const submit=()=>{
  userJson.avatar=imageUrl.value;
  // console.log(userJson)
  // let json=JSON.stringify(userJson);
  user.changePhoto(userJson).then(res=>{
    if (res.code == "000") {
      let data={userName:userJson.userId}
      user.getUserInfo(data).then(async (res) => {
        await store.commit("user/setUserInfo", res.result);
        reload();
      })
      message.success("Success");
      dialogVisible.value=false;
  
    }
    else
    {
      message.success("Fail");
    }
 
  })
}
 

//const imageUrl = ref('');

const filesChanged = (file) => {
  // console.log(file)
  // console.log(URL.createObjectURL(file.raw))
  // imageUrl.value = URL.createObjectURL(file.raw)
  btnLoading.value=true;
  handleFileChange(file.raw)


}

const handleExceed= (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

// watch(imageUrl, async (n, o) => {
// console.log(n)

// // let base64s = "";
// // for (const file of n) {
// //   const base64 = await getBase64(file);
// //   base64s += base64 + "|pic|";
// //   // form.value.attachment+= base64+"|pic|";
// // }
// // base64s = base64s.substring(0, base64s.length - 5)
// // form.value.attachment = base64s;
// })

const handleAvatarSuccess = (response,uploadFile) => {
  console.log(response)
  console.log(uploadFile)
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}

// 处理文件改变事件
const handleFileChange = (file) => { 
  // console.log(file)
  if (file) {
    // 读取文件并转换为base64
    const reader = new FileReader();
    reader.onload = () => {
      imageUrl.value = reader.result;
      // 在此处将图片数据发送到后端
      // sendImageDataToBackend(reader.result);
    };
    reader.readAsDataURL(file);
    btnLoading.value=false;
  }
};

// 处理图片点击事件
const handleImageClick = () => {
  // 触发文件选择器点击事件
  //handleFileChange
};

// 模拟发送图片数据到后端的函数
const sendImageDataToBackend = (base64ImageData) => {
  console.log('Sending image data to backend:', base64ImageData);
};

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 308px;
  height: 228px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 308px;
  height: 228px;
  text-align: center;
}
</style>
