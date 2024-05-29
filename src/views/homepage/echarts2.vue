<template>
    <div id="echart2" style="width:100%;height:100%; margin-top:10px;">
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
const {t} =useI18n()
let echart = echarts;
import storage from "@/utils/storage"
let userId = storage.get('userInfo').userName
 
let total=ref(0);
let dataArr=ref([])

onMounted(async () => {
  let pageRequest = {
    pageIndex: 1,
    pageSize: 10,
    where: "leaveType=annual",
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
        obj.carryover = data.overdue;
      }
      Object.keys(obj).forEach(i=>{
        let obj1= { value: 0, name: '', }
        if (i == "available") {
          obj1.name = i;
          obj1.value = obj[i];
          obj1["label"] = {
            show: true, // Show label for this specific data
            position: 'outside', // Position the label outside the pie slice
            formatter: function (params) {
              return params.name + "\n" + "Includes"+"\r\n"+"carryover:"+obj.carryover;
            }
          }
          dataArr.value.push(obj1)
        } else if(i== "carryover"){
          
        }
        else
        {
          obj1.name = i;
          obj1.value = obj[i];
          dataArr.value.push(obj1)
        }
      
      }); 
      // console.log(dataArr.value)
      
    } 
  });
 
  setTimeout(() => {
    initChart();
  }, 200)

})
  

function initChart() {
let chart = echart.init(document.getElementById("echart2"),"blue");

chart.setOption({
  title: {
    text: 'Annual Leave(Hours)',
    subtext: 'Total:'+total.value,
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    // formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  // legend: {
  //   orient: 'vertical',
  //   left: 'bottom'
  // },
  color: ['#91cd77', '#ef6567', 'yellow',],
  series: [
    {
      name: 'Annual Leave(Hours)',
      type: 'pie',
      radius: '50%',
      avoidLabelOverlap: false,
   
      data: dataArr.value,
      emphasis: {
        // label: {
        //   show: true,
        //   fontSize: '30',
        //   fontWeight: 'bold'
        // },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
     
    }
  ]
});

      window.onresize = function() {
        //自适应大小
        chart.resize();
      };

      return { initChart };
  }
</script>

<style lang="scss" scoped>

</style>