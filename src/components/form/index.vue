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
                                <el-option v-for="option in field.options" :key="option.value" :value="option.value"
                                    :label="option.label"></el-option>
                            </el-select>
                        </template>

                        <!-- 数字字段 -->
                        <template v-if="field.type === 'number'">
                            <el-input-number v-model="formData[field.prop]" :min="field.min" :max="field.max"
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
                        <template v-if="field.type === 'radio' && field.options">
                            <el-radio-group v-model="formData[field.prop]">
                                <el-radio v-for="option in field.options" :label="option.value"
                                    :value="option.value"></el-radio>
                            </el-radio-group>
                        </template>

                        <!-- 多选 -->
                        <template v-if="field.type === 'checkbox' && field.options">
                            <el-checkbox-group v-model="formData[field.prop]">
                                <el-checkbox v-for="option in field.options" :label="option.value"
                                    :value="option.value"></el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-form-item>
                </el-col>
            </template>
        </el-row>
    </el-form>
</template>
     
<script setup>
const props = defineProps(['formInfo', 'operateType']);
let formInfo = props.formInfo;
let formData = formInfo.formData;

let operateType = props.operateType

//监听 formInfo 变化，更新 formData 的初始值
watch(() => props.formInfo, (formInfo) => {
    for (const field of formInfo.fields) {
        console.log(formData)
        if (typeof formData[field.prop] === 'undefined') {
            formData[field.prop] = typeof field.defaultValue == Number ? field.defaultValue : field.defaultValue || '';
        }
    }
}, { immediate: true });

// watch(() => formData, (newFormData) => {
//   for (const field of formInfo.fields) {
//     if (typeof newFormData[field.prop] !== 'undefined') {
//       field.defaultValue = newFormData[field.prop];
//     }
//   }
// }, { deep: true });


const shouldDisplay = (field) => {
    // 根据传入的操作类型决定是否展示该字段
    // return data.operateType.includes(operateType);
    if (!field.operateType.includes(operateType)) {
        return false;
    }
    if (typeof field.displayCondition === 'function') {
        return field.displayCondition(formData);
    }
    return true;
};

</script>

<style scoped>
.dialog-footer {

    padding: 200px;
    padding-top: 10px;
    text-align: right;

}
</style>