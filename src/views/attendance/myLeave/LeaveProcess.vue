<template>
    <el-dialog center title="流程" v-model="dialogVisible" width="30%">

        <el-steps direction="vertical" :active="2" :space="90">
            <template v-for="process in processData">
                <el-step 
                :active="process.orderNo"
                :title="process.userId + '\r'+ (process.processState!='wait'? process.auditTime:'')" 
                :description="process.processState=='error'?'reject':process.processState + '\r'+ process.action" 
                :status="process.processState"
                finish-status="success">
                </el-step>
            </template>
             
            <!-- <el-step title="创建时间" :description='dialog_data.applyTime'></el-step>
            <el-step title="已提交审核"></el-step>
            <el-step title="请等待主管审核"></el-step> -->
        </el-steps>

        <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span> -->
    </el-dialog>
</template>

<script setup>

import {LeaveProcess} from "@/api/attendance/leaveProcess"
const leaveProcess=new LeaveProcess();
const props=defineProps(["leaveId"]);

let processData=ref([]);

onMounted(()=>{
    console.log(props);
    GetData();
})

const GetData=()=>{
    let pageRequest={
  pageIndex: 1,
  pageSize: 10,
  where: "",
  order: "orderNo",
  defaultWhere: `leaveId=${props.leaveId}`
}
let postJson=JSON.stringify(pageRequest);
leaveProcess.getPageList(postJson).then(res => {
    console.log(res)
    if (res.code == "000") {
        processData.value = res.result;
       console.log(res.result)
    } else {
      message.error(res.message)
    }
  }); 
}

let dialogVisible = ref(true);
let handleClose = () => { };
let dialog_data = ref({ status: 2, applyTime: '2023-10-12', reviewTime: '2023-10-12' });
let dateFormat = (time) => {
    var date = new Date(time * 1000)
    return moment(date).format('YYYY-MM-DD')
};
let dateTimeFormat = (time) => {
    var date = new Date(time * 1000)
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}




</script>

<style lang="scss" scoped></style>