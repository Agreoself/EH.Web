<template>
    <el-row>
        <div style="margin-top: 5px;margin-bottom: 5px;">
            <template v-for="(button,index) in buttonList">
                <el-button ref="buttonItem" :size="button.size" :type="button.type" :icon="button.icon" @click="button.click" v-if="shouldDisplay(button)">{{t( button.text)}}</el-button>
            </template>
        </div>
        <div v-if="dynamicList!=undefined" style="margin-left: 10px; padding-top: 2px;">
            <template v-for="(dy,index) in dynamicList">
                <template v-if="dy.type=='switch'">
                    <el-switch style="--el-switch-on-color: #13ce66; --el-switch-off-color: #000" v-model="dy.value" inline-prompt :active-text="dy.activeText" :inactive-text="dy.inactiveText" v-if="dyShouldDisplay(dy)" @change="switchChange(dy.value)"/>
                </template>
            </template>
        </div>
    </el-row>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps(['buttonInfo','dynamicInfo']);
const buttonList = props.buttonInfo;
const dynamicList = props.dynamicInfo;
// console.log(props)
const {t}=useI18n();
const emits = defineEmits(['CallButton']);

let buttonItem=ref();
const shouldDisplay = (button) => {
    // 根据传入的操作类型决定是否展示该字段 
    // if (!field.operateType.includes(operateType)) {
    //     return false;
    // }
    if(button.displayCondition!=undefined){
        if (typeof button.displayCondition === 'function') {
        // console.log(button.displayCondition())
        return button.displayCondition();
    }
    }
    return true;
};

const dyShouldDisplay = (dynamic) => {
    // 根据传入的操作类型决定是否展示该字段 
    if(dynamic.displayCondition!=undefined){
        if (typeof dynamic.displayCondition === 'function') {
        // console.log(button.displayCondition())
        return dynamic.displayCondition();
    }
    }
    return true;
};

const switchChange=(value)=>{
    let data = {
    method: 'switchChange',
    data: value
  };
  emits('CallButton', data)
}

const setButtonType=(data)=>{
    // console.log(buttonItem.value[data.index].type)
    buttonItem.value[data.index].type=data.type;
}

const Expose=(method,data)=>{
    if(method=="setButtonType"){
        setButtonType(data)
    }
}

defineExpose({
    Expose
})
 

</script>

<style lang="scss" scoped></style>