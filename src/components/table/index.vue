<template>
    <el-table ref="tables"
    :table-layout="table.tableLayout" 
    :data="table.tableData" 
    style="width: 100%;margin-bottom: 20px;height: 560px;"
    :max-height="table.maxHeight" 
    stripe 
    row-key="ID" 
    :size="table.size" 
    show-overflow-tooltip 
    highlight-current-row
    @selection-change="handleSelectionChange" 
    @current-change="handleCurrentRowChange"
    @row-click="rowClick"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"> 

        <el-table-column type="selection" width="55"  />
        <el-table-column v-for="column in table.tableColumn" 
        :prop="column.prop" 
        :label="column.label" 
        :key="column.prop"
        :sortable="column.sort" 
        :width="column.width">

          <template v-slot:header>
            <div class="filter-cell">
              <div>{{ column.label }}</div>
              <template v-if="column.type=='string'">
                <el-input v-model="column.filterValue" style="width:100%" size="small" :placeholder="'筛选' + column.label"  
                clearable @click.stop @blur="filterChange(column.prop, column.filterValue)" />
              </template>
              <template v-else-if="column.type=='date'">
                <el-date-picker v-model="column.filterValue" style="width: 100%;" size="small" type="datetime" :placeholder="'筛选' + column.label" value-format="YYYY-MM-DD"  @click.stop @change="filterChange(column.prop, column.filterValue)" />
              </template>
              <template v-else-if="column.type=='int'">
                <el-select v-model="column.filterValue" class="m-2" :placeholder="'筛选' + column.label" style="width:100%" size="small" @click.stop @change="filterChange(column.prop, column.filterValue)" clearable>
                <el-option
                v-for="item in column.options"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
                </el-select>
              </template>
              <template v-else>
                <el-input v-model="column.filterValue" style="width:100%" size="small" :placeholder="'筛选' + column.label"  
                clearable @click.stop @blur="filterChange(column.prop, column.filterValue)" />
              </template>
            
            </div> 
          </template>

          <template v-if="column.scope" #default="scope"> 
              <div slot="reference" class="name-wrapper">  
                {{  Expression(scope.row,column.prop) }}
              </div>
            </template>

        </el-table-column>
 
      </el-table>

      <el-pagination :small="table.pagerSmall" :pagerCount="table.pagerCount" v-model:current-page="table.pageRequest.pageIndex" v-model:page-size="table.pageRequest.pageSize"
        :page-sizes="table.pageSizes" :background="true" :layout="table.layout" :total="table.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
 
</template>

<script setup>
 
const prop=defineProps(['tableInfo']);
const emits=defineEmits(['CallTable']);

let table=prop.tableInfo; 
let tables=ref(); 
  
let whereKeyList = [];
let whereValList = {};
let whereList = [];

const Expression=(row,prop)=>{ 
  switch (prop){
    case 'isAdmin': return row.isAdmin?'管理员':'普通';
    case 'isActive': return row.isActive?'启用':'禁用';
    case 'gender': return row.gender==1?'男':'女'; 
    case 'menuType':return row.menuType==0?'目录':'组件';
    
  } 
}

let filterChange=(key,value)=>{
    if (value+'' != ""&&value!=null) {
    let whereStr = key + "=" + value;

    if (whereKeyList.filter(i => i == key).length == 0) {
      whereKeyList.push(key);
      whereValList[key] = value;
      whereList.push(whereStr);
    }
    else if (whereValList[key] != value) {
      // Object.keys(whereValList)[key].value!=value 
      whereValList[key] = value
      let newArr = whereList.filter(i => !i.startsWith(key + '='));
      whereList = newArr;

      whereList.push(whereStr);
    }
    else {
      return;
    }
  }
  else
  {
    if(whereKeyList.filter(i => i == key).length != 0)
    {
      whereValList[key] = value
      let newArr = whereList.filter(i => !i.startsWith(key + '='));
      whereList = newArr;
    }
  } 
  // console.log(whereList);
  table.pageRequest.where= whereList.join(','); 
  let data={
    method:'filterChange',
    needRefresh:true,
    table:table
  };
  emits('CallTable',data)
}

let handleSelectionChange = (item) => {
  table.selectRow = item; 
  let data={
    method:'selectionChange',
    needRefresh:false,
    table:table
  };
  emits('CallTable',data)
}

let handleCurrentRowChange=(now,old)=>{
  table.currentRow = now; 
  let data={
    method:'currowRowChange',
    needRefresh:false,
    table:table
  };
  emits('CallTable',data);
}

const rowClick=(row)=>{
  if(row!=null){
    tables.value.clearSelection();
    tables.value.toggleRowSelection(row); 
  }
}

const handleCurrentChange = () => {
    let data={
    method:'currentChange',
    needRefresh:true,
    table:table
  };
  emits('CallTable',data)
}

const handleSizeChange = () => {
    let data={
    method:'sizeChange',
    needRefresh:true,
    table:table
  };
  emits('CallTable',data)
}

onMounted(()=>{ 
  let data={
    method:'done',
    needRefresh:false,
    table:table
  };
  emits('CallTable',data);
})

onUpdated(()=>{
  nextTick(()=>{
    let firstRow=table.tableData[0];
    if(firstRow!=undefined&&firstRow!=null){
      tables.value.setCurrentRow(firstRow);
      rowClick(firstRow);
    }
    })
})

const setDefaultFilter=(key,value)=>{
  filterChange(key,value)
}

defineExpose({
  filterChange,
  setDefaultFilter,
})

</script>

<style lang="scss" scoped>

</style>