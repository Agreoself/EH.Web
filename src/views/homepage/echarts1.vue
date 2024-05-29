<template>
    <div id="echart1" style="width: 100%; height: 100%; ">
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

const {t} =useI18n()
let echart = echarts;
import { LeaveForm } from '@/api/attendance/leaveForm';
const leaveForm = new LeaveForm();
import storage from "@/utils/storage"
let userId = storage.get('userInfo').userName

let isCollapse=localStorage.getItem("collapse");

// let props = defineProps(["data"]);
// console.log(props.data)
let dataArr=ref([]);
  
onMounted(async ()=>{
  let postData = { userId: userId }
  await leaveForm.getHomePageBodyData(postData).then(res => {
    dataArr.value=res.result;
  }); 

 setTimeout(()=>{
  initChart();
 },200)
    
})
  
 
function initChart() {
let chart = echart.init(document.getElementById("echart1"),"blue",{notMerge: true, lazyUpdate: true});

  chart.setOption({
    xAxis: {
      name: 'Month',
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
    },
    tooltip: {
      trigger: "axis"
    },
    yAxis: {
      name: 'Current Year Leave TotalHours',
      type: "value"
    },
    series: [
      {

        data: dataArr.value, //[1,5,20,15,17,8,6,8,32,24,15,22],
        type: "line",
        smooth: true
      }
    ],
    grid: {
      top: '15%',  // 组件离容器上侧的距离,百分比字符串或整型数字
      left: '10%',    // 组件离容器左侧的距离,百分比字符串或整型数字
      right: '10%',
      bottom: '3%',
      containLabel: true //grid 区域是否包含坐标轴的刻度标签，
    },
  });

  // window.onresize = function() {
  //   //自适应大小
  //   chart.resize();
  // };
  window.addEventListener("resize", () => {
    chart.resize();
  });

  return { initChart };
}

  
</script>

<style lang="scss" scoped>

</style>