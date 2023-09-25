<template>
    <el-row>
        <div style="margin-top: 5px;margin-bottom: 5px;">
            <template v-for="button in buttonList">
                <el-button :size="button.size" :type="button.type" :icon="button.icon" @click="button.click">{{ button.text
                }}</el-button>
            </template>
        </div>
    </el-row>
</template>

<script setup>
const props = defineProps(['buttonInfo']);
const buttonList = props.buttonInfo;

</script>

<style lang="scss" scoped></style>