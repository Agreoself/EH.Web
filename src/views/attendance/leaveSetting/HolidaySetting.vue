<template>
    
    <div id="calendar" v-loading="loading">
        <div class="choose-head">
            <!-- <div class="choose-year">{{ currentYear }} 年工作日历</div> -->
            <div class="choose-search">
                <!-- <el-input v-model.trim="currentYear" class="choose-input" placeholder="">
            {{ currentYear }}
          </el-input> -->
                <el-input-number v-model="currentYear" @change="yearChange(currentYear)" :min="minYear" :max="maxYear" /> 
                &nbsp;&nbsp;
                <el-tooltip class="box-item" effect="dark"
                    content="Click on the date you want to modify, change the type, and finally save" placement="top">
                    <Warning style="width:30px; height: 30px; color: red;" />
                </el-tooltip>
                &nbsp;&nbsp;
                <el-button @click="saveHoliday" type="primary">{{t('保存')}}</el-button>
                <el-button @click="refresh" type="primary">{{t('刷新')}}</el-button>
                <!-- <el-button @click="handleChangePickPre(currentYear)">&lt;</el-button>
          <el-button @click="handleChangePickNext(currentYear)">&gt;</el-button> -->
            </div>
        </div>
        <div v-for="item in calendarDataList" :key="item.month" class="calendarList">
            <div class="title-month">{{ t(item.month) }}</div>
            <ul class="weekdays">
                <li>{{t('日')}}</li>
                <li>{{t('一')}}</li>
                <li>{{t('二')}}</li>
                <li>{{t('三')}}</li>
                <li>{{t('四')}}</li>
                <li>{{t('五')}}</li>
                <li>{{t('六')}}</li>
            </ul>
            <ul class="days">
                <li v-for="x in item.xq" :key="item.month + '-day' + x"></li>
                <li v-for="l in item.list" :key="item.month + '-' + l">
                     <span v-if="l.type == 1" @click="handleChangeTime(item.months,l)" class="active" style="cursor: pointer;">{{ l.name
                    }}</span>
                    <span v-else @click="handleChangeTime(item.months,l)" style="cursor: pointer;">{{ l.name }}</span>

                    <!-- <span v-else @click="handleChangeTime(l.type)" style="cursor: pointer;">{{ l.name }}</span> -->
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script setup>
import { InfoFilled } from '@element-plus/icons-vue';
import { HolidaySetting } from "@/api/attendance/holidaySetting";
import {message} from "@/utils/message"
import { useI18n } from 'vue-i18n';
const holidaySetting = new HolidaySetting();
const {t} =useI18n();

const currentYear = ref(new Date().getFullYear());
const minYear = currentYear.value - 3;
const maxYear = currentYear.value + 3;
const calendar = [
    { telit: '2023-1-1' },
    { telit: '2023-1-3' },
    { telit: '2023-7-9' },
];

const loading = ref(true)

const calendarDataList = ref([
    { month: '一月', months: 1, day: 0, xq: 0, list: [] },
    { month: '二月', months: 2, day: 0, xq: 0, list: [] },
    { month: '三月', months: 3, day: 0, xq: 0, list: [] },
    { month: '四月', months: 4, day: 0, xq: 0, list: [] },
    { month: '五月', months: 5, day: 0, xq: 0, list: [] },
    { month: '六月', months: 6, day: 0, xq: 0, list: [] },
    { month: '七月', months: 7, day: 0, xq: 0, list: [] },
    { month: '八月', months: 8, day: 0, xq: 0, list: [] },
    { month: '九月', months: 9, day: 0, xq: 0, list: [] },
    { month: '十月', months: 10, day: 0, xq: 0, list: [] },
    { month: '十一月', months: 11, day: 0, xq: 0, list: [] },
    { month: '十二月', months: 12, day: 0, xq: 0, list: [] },
]);

const vacation = ref('');

let holidays = [];

onMounted(async () => { 
   
    await handleChangeInitData();
    loading.value=false;
    // console.log(calendarDataList.value)
    // getCurrentDay();
});


const getHoliday = async (year) => {
    
    if (year != undefined) {
        currentYear.value = year;
    } else {
        let date = new Date();
        let year = date.getFullYear();
        currentYear.value = year;
    }
    let postData = { year: currentYear.value };

    await holidaySetting.getHoliday(postData).then(res => {
        holidays=res.result;
        for (var m = 0; m < calendarDataList.value.length; m++){
            for (var d = 0; d < calendarDataList.value[m].list.length; d++){
                vacation.value = currentYear.value + "-" + calendarDataList.value[m].months.toString().padStart(2, '0') + "-" + calendarDataList.value[m].list[d].name.toString().padStart(2, '0');
                holidays.indexOf(vacation.value)>-1?calendarDataList.value[m].list[d].type = 1:calendarDataList.value[m].list[d].type
            }
            
        }
    })
}

const getCurrentDayCalendar = (year) => {
    for (let i = 0; i < calendarDataList.value.length; i++) {
        calendarDataList.value[i].list = [];
        // 获取每月天数
        let thisDate = new Date(year, calendarDataList.value[i].months, 0);
        calendarDataList.value[i].day = thisDate.getDate(); //赋值-获取天数

        for (var j = 1; j <= calendarDataList.value[i].day; j++) {

            //1.拿到了list的天数
            calendarDataList.value[i].list.push({
                name: j,
                type: 0,
            });
        }

        //#region 
        // for (var h = 0; h < calendarDataList.value[i].list.length; h++) {
        //     // 年月日
        //     vacation.value = year + "-" + calendarDataList.value[i].months + "-" + calendarDataList.value[i].list[h].name;

        //     // 用12月的年月日和calendar中年月日对比
        //     for (let k = 0; k < holidays.length; k++) {
        //         // 如果相等结束循环 || new Date(vacation.value).getDay()==0||new Date(vacation.value).getDay()==6
        //         // if (calendar[k].telit == vacation.value ) {
        //         console.log(holidays[k])
        //         if (holidays[k] == vacation.value) {
        //             calendarDataList.value[i].list[h].type = 1;
        //             break;
        //         } else {
        //             calendarDataList.value[i].list[h].type = 0;
        //         }
        //     }
        // }
        //#endregion
        
        // 获取前月的第一天是星期几，空几格
        let date = new Date(year, calendarDataList.value[i].months - 1, 1);
        calendarDataList.value[i].xq = date.getDay();
    }
};

const handleChangeInitData =async (year) => { 
    if (year != undefined) {
        currentYear.value = year;
        getCurrentDayCalendar(year);
        await getHoliday(year);
    } else {
        let date = new Date();
        let year = date.getFullYear();
        getCurrentDayCalendar(year);
        await getHoliday(year);
    }
   
};

const yearChange = (year) => {
    currentYear.value = year;
    handleChangeInitData(year);
}

const handleChangeTime = (month,data) => {
    let date=currentYear.value+'-'+month.toString().padStart(2,'0')+'-'+data.name.toString().padStart(2,'0');
    if(data.type==1){
        data.type=0;
        holidays = holidays.filter(i => i != date);
    }
    else
    {
        data.type=1;
        holidays.push(date);
    }
    // console.log(holidays)
     
};

const saveHoliday=()=>{
    let postJson=JSON.stringify(holidays);
    loading.value=true;
    holidaySetting.saveHoliday(postJson).then(res=>{
        if(res.code=="000"){
            loading.value=false;
            message.success(res.message);

        }else{
            message.error(res.message);
        }
    })
}

const refresh=async ()=>{
    await handleChangeInitData();

}

const getCurrentDay = () => {
    // Implementation of getCurrentDay function
};
</script>


<style>
#calendar {
    font-size: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 auto;
    padding: 0px;
}

.title-month {
    color: #ffffff;
    font-size: 18px;
    text-align: center;
    background-color: #2d2d83;
}

.calendarList {
    width: 24%;
}

.choose-head {
    width: 100%;
    padding: 4px;
    background-color: #ffffff;
}

.choose-year {
    text-align: center;
    font-size: 25px;
}

.choose-search {
    display: flex;
    flex-flow: flex-end;
    justify-content: center;
}

.choose-input {
    width: 100px !important;
}

.month {
    width: 100%;
    color: #333333;
}

.month ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    height: 35px;
}

.year-month {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;
}

.choose-month {
    text-align: center;
    font-size: 12px;
}

.arrow {
    padding: 15px;
    color: #f7f5f5;
}

.month ul li {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 3px;
}

.weekdays {
    margin: 0;
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
    color: #999;
    justify-content: space-around;
}

.weekdays li {
    display: inline-block;
    width: 13.6%;
    text-align: center;
}

.days {
    padding: 8px 8px;
    background: #ffffff;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
}

.days li {
    /* calendardatalist-style-type: none; */
    display: inline-block;
    width: 14.2%;
    text-align: center;
    padding-bottom: 2px;
    padding-top: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #000;
}

.days li .active {
    /* border-radius: 50%;
    padding: 5px 5px;
    background: green; */
    /* color: rgb(2, 202, 2); */
    color: red;

}

.days li .other-month {
    padding: 5px;
    color: gainsboro;
}

.days li:hover>span>span {
    padding: 6px 6px;
    background: #e1e1e1;
    color: #fff;
}</style>
  
  
  
  