<template>
    <el-upload v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false"
            :multiple="true" :limit="4" :on-change="filesChanged" :on-remove="handleRemove">
            <el-icon>
              <Plus />
            </el-icon>
            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
  </template>
  <script setup>
  import { ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'  
  
  const fileList = ref([
    // {
    //   name: 'element-plus-logo.svg',
    //   url: 'https://element-plus.org/images/element-plus-logo.svg',
    // },
    // {
    //   name: 'element-plus-logo2.svg',
    //   url: 'https://element-plus.org/images/element-plus-logo.svg',
    // },
  ])
  
  const handleRemove = (file, uploadFiles) => {
    console.log(file, uploadFiles)
  }
  
  const handlePreview=(uploadFile) => {
    console.log(uploadFile)
  }
  
  const handleExceed = (files, uploadFiles) => {
    ElMessage.warning(
      `The limit is 3, you selected ${files.length} files this time, add up to ${
        files.length + uploadFiles.length
      } totally`
    )
  }
  
  const beforeRemove = (uploadFile, uploadFiles) => {
    return ElMessageBox.confirm(
      `Cancel the transfer of ${uploadFile.name} ?`
    ).then(
      () => true,
      () => false
    )
  }
  </script>
  