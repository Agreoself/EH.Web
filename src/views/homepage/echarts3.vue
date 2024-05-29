<template>
  <div id="echart3" style="width:100%;height:100%; margin-top:10px;">
  </div>
</template>

<script setup>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart,LineChart,PieChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

import { LeaveManage } from '@/api/attendance/leaveManage';
const leaveManage = new LeaveManage();
const { t } = useI18n()
let echart = echarts;
import storage from "@/utils/storage"
let userId = storage.get('userInfo').userName

let isCollapse = localStorage.getItem("collapse");
// let props = defineProps(["data"]);
// console.log(props.data)
 
let total=ref(0);
let dataArr=ref([])

onMounted(async () => {
  let pageRequest = {
    pageIndex: 1,
    pageSize: 10,
    where: "leaveType=sick",
    order: "leaveType",
    defaultWhere: `userId=${userId}`
  }

  await leaveManage.getPageList(pageRequest).then(res => {
    if (res.code == "000") {
      let obj = {  available: 0, used: 0, locked: 0 }; 
      if(res.result.length>0){
        let data=res.result[0];
        total.value = data.total;
        obj.available = data.available;
        obj.used = data.used;
        obj.locked = data.locked;
      }
      Object.keys(obj).forEach(i=>{
        let obj1= { value: 0, name: '' }
        obj1.name=i;
        obj1.value=obj[i];
        dataArr.value.push(obj1)
      }); 
    } 
  });
  // dataArr=await getData()
  setTimeout(() => {
    initChart();
  }, 200)

})

const initChart =async ()=> {
  let chart = echart.init(document.getElementById("echart3"), "blue");

  chart.setOption({
    title: {
      text: 'Sick Leave(Hours)',
      subtext: 'total:'+total.value,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'left'
    // },
    color: ['#91cd77', '#ef6567', 'yellow'],
    series: [
      {
        name: 'Sick Leave(Hours)',
        type: 'pie',
        radius: '50%',
        data: dataArr.value, //[
          // { value: 1048, name: 'Search Engine' },
          // { value: 735, name: 'Direct' },
          // { value: 580, name: 'Email' },
          // { value: 484, name: 'Union Ads' },
        //],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
      }
    ]
  });

  window.onresize = function () {
    //自适应大小
    chart.resize();
  };

  return { initChart };
}
</script>

<style lang="scss" scoped></style>