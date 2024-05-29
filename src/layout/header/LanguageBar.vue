<!--  -->
<template>
    <div>
        <el-dropdown style="cursor:pointer;" trigger="click">
            <div>
                <img style="width: 25px; height: 25px; ;" src="@/assets/lang.png" />
        
            </div>

            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="toLang('zh-cn')" :disabled="getCurrentLang == 'zh-cn'">中文</el-dropdown-item>
                    <el-dropdown-item @click="toLang('en')" :disabled="getCurrentLang == 'en'">English</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div> 
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const i18n = useI18n()

const getCurrentLang = computed(() => {
    return i18n.locale.value
})

const reload = inject("reload");

const toLang = (lang) => {
    i18n.locale.value = lang
    localStorage.setItem('lang', lang)
    reload();
}

</script>
<style lang='scss' scoped>
</style>