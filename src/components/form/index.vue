<template>
    <el-form :model="formData" :label-position="formInfo.labelPosition" :rules="formInfo.rules">
        <el-row :gutter="formInfo.gutter">
            <template v-for="field in formInfo.fields">
                <el-col :span="field.span">
                    <el-form-item v-if="shouldDisplay(field)" :label="field.label" :prop="field.prop"
                        :label-width="formInfo.labelWidth">
                        <!-- 文本 -->
                        <template v-if="field.type === 'input'">
                            <template v-if="field.max < 220">
                                <el-input v-model="formData[field.prop]" :placeholder="field.placeholder" />
                            </template>
                            <template v-else>
                                <el-input type="textarea" v-model="formData[field.prop]" :placeholder="field.placeholder" />
                            </template>

                        </template>
                        <!-- 下拉 -->
                        <template v-if="field.type === 'select'">
                            <el-select v-model="formData[field.prop]" :placeholder="field.placeholder" style="width:100%">
                                <el-option v-for="option in allDic[field.prop]" :key="option.value" :value="option.value"
                                    :label="option.label"></el-option>
                            </el-select>
                        </template>

                        <!-- 数字字段 -->
                        <template v-if="field.type === 'number'">
                            <el-input-number v-model.number="formData[field.prop]" :min="field.min" :max="field.max"
                                :placeholder="field.placeholder" style="width:100%" />
                        </template>

                        <!-- 级联选择 -->
                        <template v-if="field.type === 'cascader' && field.options">
                            <el-cascader :placeholder="field.placeholder" :props="field.defaultParams"
                                v-model="formData[field.prop]" :options="field.options" style="width:100%" />
                        </template>

                        <!-- 时间选择 -->
                        <template v-if="field.type === 'time'">
                            <el-date-picker v-model="formData[field.prop]" type="datetime" :placeholder="field.placeholder"
                                style="width:100%" />
                        </template>

                        <!-- 开关 -->
                        <template v-if="field.type === 'switch'">
                            <el-switch v-model="formData[field.prop]" />
                        </template>

                        <!-- 单选 -->
                        <template v-if="field.type === 'radio' ">
                            <el-radio-group v-model="formData[field.prop]">
                                <el-radio v-for="option in allDic[field.prop]" :label="JSON.parse(option.value)"
                                    :value="option.value">{{ option.label }}</el-radio>
                            </el-radio-group>
                        </template>

                        <!-- 多选 -->
                        <template v-if="field.type === 'checkbox'">
                            <el-checkbox-group v-model="formData[field.prop]">
                                <el-checkbox v-for="option in allDic[field.prop]" :label="option.label"
                                :key="option.value" :value="option.value"></el-checkbox>
                            </el-checkbox-group>
                        </template>

                        <template v-if="field.type==='upload'">
                            <Upload/>
                        </template>
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
    </el-form>

    <template v-if="formInfo.hasButton">
        <div class="button-container"  >
            <template v-for="button in formInfo.buttonInfo">
                <el-button v-if="shouldDisplay(button)" :size="button.size" :type="button.type" :icon="button.icon"
                    @click="button.click">{{ button.text }}</el-button>
            </template>
        </div>
    </template>
</template>
     
<script setup> 
import allDic from '@/utils/dictionary'
import  Upload from './upload.vue';
const props = defineProps(['formInfo', 'operateType']);
let formInfo = props.formInfo;
let formData = formInfo.formData;

let operateType = props.operateType

//监听 formInfo 变化，更新 formData 的初始值
watch(() => props.formInfo, (formInfo) => {
    for (const field of formInfo.fields) {
        // console.log(formData)
        if (typeof formData[field.prop] === 'undefined') {
            // console.log(typeof field.defaultValue==typeof (1))
            formData[field.prop] = typeof field.defaultValue == typeof 1 ? field.defaultValue : field.defaultValue || '';
        }
    }
    console.log(formData)
}, { immediate: true });

  
const shouldDisplay = (field) => {
    // 根据传入的操作类型决定是否展示该字段
    // return data.operateType.includes(operateType);
    if (!field.operateType.includes(operateType)) {
        return false;
    }
    if (typeof field.displayCondition === 'function') {
        console.log(field.displayCondition(formData))
        return field.displayCondition(formData);
    }
    return true;
};
 
</script>

<style scoped>
.button-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: right;
  margin-bottom:10px;
  padding-right: 10px;  
}
</style>