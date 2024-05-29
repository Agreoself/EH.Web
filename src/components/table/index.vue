<template>
  <el-table ref="tables" v-loading="loading" table-layout="auto" :border="true" style="width: 100%; margin-bottom: 20px;"
    :height="table.height" :max-height="table.height" row-key="ID" :size="table.size" :data="table.tableData"
    show-overflow-tooltip :highlight-current-row="heightlight" @selection-change="handleSelectionChange"
    @current-change="handleCurrentRowChange" @row-click="rowClick" @row-dblclick="rowDbClick" @cell-click="cellClick"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :row-class-name="tableRowClassName"
    :cell-style="cellStyle"
    >

    <el-table-column type="selection" width="50" />
    <el-table-column v-for="column in table.tableColumn" :prop="column.prop" :label="column.label" :key="column.prop"
      :width="column.width" >
      <!-- @sort-change="handleSortChange(column)" -->
      <!-- :sortable="true" --> 
      <template #header>  
        <span :id="column.prop">
          {{ t(column.label) }}
          <span v-if="column.sort" class="sortClass">
            <i id="asc" class="sort-caret ascending"  @click="sortChange(column,false)"></i>
            <i id="desc" class="sort-caret descending"  @click="sortChange(column,true)"></i> 
          </span> 
        </span>
        <template v-if="column.type == 'string'">
          <el-input v-model="column.filterValue" style="width:100%" size="small"
            :placeholder="t('筛选') + t(column.label)" clearable @click.stop
            @blur="filterChange(column.prop, column.filterValue)" :disabled="column.disabled" />
        </template>
        <template v-else-if="column.type == 'date'">
          <el-date-picker v-model="column.filterValue" style="width: 100%;" size="small" type="datetime"
            :placeholder="t('筛选') + t(column.label)" value-format="YYYY-MM-DD" @click.stop
            @change="filterChange(column.prop, column.filterValue)" />
        </template>
        <template v-else-if="column.type == 'int'">
          <el-select v-model="column.filterValue" class="m-2" :placeholder="t('筛选') + t(column.label)"
            style="width:100%" size="small" @click.stop
            @change="filterChange(column.prop, column.filterValue, column.multiple)" clearable
            :multiple="column.multiple" :max-collapse-tags="1" collapse-tags>
            <template v-if="column.multiple" #header>
              <el-checkbox v-model="column.header.checkAll" @change="column.header.handleCheckAll">All</el-checkbox>
            </template>
            <el-option v-for="item in column.options ?? allDic[column.prop]" :key="item.value" :label="t(item.label)"
              :value="item.value" />
          </el-select>
        </template>
        <template v-else-if="column.type == 'decimal'">
          <el-input-number v-model="column.filterValue" style="width:100%" size="small"
            :placeholder="t('筛选') + t(column.label)" clearable @click.stop
            @blur="filterChange(column.prop, column.filterValue)"></el-input-number>
        </template>
        <template v-else>
          <!-- <el-input v-model="column.filterValue" style="width:100%" size="small" :placeholder="t('筛选') +t(column.label)"
            clearable @click.stop @blur="filterChange(column.prop, column.filterValue)" /> -->
        </template>
 
      </template>
 
      <template v-if="column.scope" #default="scope">
        <div slot="reference" class="name-wrapper">
          {{ Expression(scope.row, column.prop) }}
        </div>
      </template>


    </el-table-column>

  </el-table>

  <el-pagination :small="table.pagerSmall" :pagerCount="table.pagerCount"
    v-model:current-page="table.pageRequest.pageIndex" v-model:page-size="table.pageRequest.pageSize"
    :page-sizes="table.pageSizes" :background="true" :layout="table.layout" :total="table.total"
    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
</template>

<script setup>
import allDic from '@/utils/dictionary'
import { nextTick } from 'vue';
// import storage from "@/utils/storage";
const prop = defineProps(['tableInfo']);
const emits = defineEmits(['CallTable']);
 
// const allDic = storage.get("allDic");
let table = prop.tableInfo;
let tables = ref();
const loading = ref(true)
const { t } = useI18n();

let cStyle = { "cursor": "pointer", "color": "blue", "text-decoration": "underline" };

let cellStyle = (data) => {
  // console.log(data.column.property)
  if (data.column.property == 'leaveId'||data.column.property=='requestID') {
    return cStyle;
  }
}

let heightlight = ref(true);

let whereKeyList = [];
let whereValList = {};
let whereList = [];

const Expression = (row, prop) => {
  let refValue = "";
  const dic = allDic[prop];
  const valueDic = dic.map(i => i.value);
  const labelDic = dic.map(i => i.label);
  if (dic != undefined && row[prop] != undefined) {
    valueDic.forEach((item, index) => {
      switch (row[prop] + '') {
        case item: refValue = labelDic[index]
      };
    });
    return t(refValue);
  }
 
}

const sortChange = (column,des) => {
  var desElement=document.getElementById(column.prop).children;
  // if(des)
  // {    
  //   desElement[0].offsetParent.className+=" descending" 
  // }
  // else{
  //   desElement[0].offsetParent.className+=" descending" 
  // }

  table.pageRequest.order=column.prop;
  table.pageRequest.isDesc=des;
  tables.value.sort(column.prop,des);
  let data = {
    method: 'sortChange',
    needRefresh: true,
    table: table,
    dom:desElement,
    order:des
  };
  emits('CallTable', data)
}

let multiplefilterChange = (filterArr) => {
  filterArr.forEach(fta => {
    if (fta.value + '' != "" && fta.value != null) {
      if (fta.multiple) {
        fta.value = "[" + fta.value.join('&') + "]";
      }

      let whereStr = fta.key + "=" + fta.value;
      if (whereKeyList.filter(i => i == fta.key).length == 0) {
        whereKeyList.push(fta.key);
        whereValList[fta.key] = fta.value;
        whereList.push(whereStr);
      }
      else if (whereValList[fta.key] != fta.value) {
        // Object.keys(whereValList)[key].value!=value 
        whereValList[fta.key] = fta.value
        let newArr = whereList.filter(i => !i.startsWith(fta.key + '='));
        whereList = newArr; 
        whereList.push(whereStr);
      }
      else {
         
      }
    }
    else {
      if (whereKeyList.filter(i => i == fta.key).length != 0) {
        whereValList[fta.key] = fta.value
        let newArr = whereList.filter(i => !i.startsWith(fta.key + '='));
        whereList = newArr;
      }
    }
  })
  
  console.log(whereList);
  table.pageRequest.where = whereList.join(',');
  let data = {
    method: 'multiplefilterChange',
    needRefresh: true,
    table: table
  };
  emits('CallTable', data)
}

let filterChange = (key, value, multiple = false) => {
  if (value + '' != "" && value != null) {

    if (multiple) {
      value = "[" + value.join('&') + "]";
    }
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
  else {
    if (whereKeyList.filter(i => i == key).length != 0) {
      whereValList[key] = value
      let newArr = whereList.filter(i => !i.startsWith(key + '='));
      whereList = newArr;
    }
  }
  // console.log(whereList);
  table.pageRequest.where = whereList.join(',');
  let data = {
    method: 'filterChange',
    needRefresh: true,
    table: table
  };
  emits('CallTable', data)
}

let handleSelectionChange = (item) => {
  table.selectRow = item;
  let data = {
    method: 'selectionChange',
    needRefresh: false,
    table: table
  };
  emits('CallTable', data)
}

let handleCurrentRowChange = (now, old) => {
  table.currentRow = now;
  let data = {
    method: 'currowRowChange',
    needRefresh: false,
    table: table
  };
  emits('CallTable', data);
}

const rowClick = (row) => {
  if (row != null) {
    tables.value.clearSelection();
    tables.value.toggleRowSelection(row);
  }
}

const cellClick = (row, column, cell) => {
  let data = {
    method: 'cellClick',
    needRefresh: false,
    table: table,
    cell: cell,
    row: row,
    column: column,
  };
  emits('CallTable', data)
}

const rowDbClick = (row) => {
  if (row != null) {
    tables.value.clearSelection();
    tables.value.toggleRowSelection(row);
  }
  let data = {
    method: 'rowDbClick',
    needRefresh: false,
    table: table,
    row: row,
  };
  emits('CallTable', data)
}

const handleCurrentChange = () => {
  let data = {
    method: 'currentChange',
    needRefresh: true,
    table: table
  };
  emits('CallTable', data)
}

const handleSizeChange = () => {
  let data = {
    method: 'sizeChange',
    needRefresh: true,
    table: table
  };
  emits('CallTable', data)
}

onMounted(() => {
  let data = {
    method: 'done',
    needRefresh: false,
    table: table
  };
  emits('CallTable', data);
})

onUpdated(() => {
  nextTick(() => {
    let firstRow = table.tableData[0];
    if (firstRow != undefined && firstRow != null) {
      tables.value.setCurrentRow(firstRow);
      rowClick(firstRow);
    }
  })
})
 
const setFilterLabel = (key, value) => {
  // console.log(table.tableColumn.filter(i=>i.prop==key)[0].filterValue)
  table.tableColumn.filter(i => i.prop == key)[0].filterValue = value
}
  
const clearFilter = () => {
  table.tableColumn.forEach(e => {
    e.filterValue = ''
  });
}

const closeHeightlight = () => {
  heightlight.value = false;
}

const closeLoading = () => {
  loading.value = false;
}
const openLoading = () => {
  loading.value = true;
}

const tableRowClassName = ({ row }) => {
  // console.log(row)
  if (row.currentState == 1 || row.currentState == 0) {
    return 'warning-row';
  } else if (row.currentState == 2) {
    return 'success-row';
  } else if (row.currentState == 3) {
    return 'danger-row';
  }
  return '';
};
const setColumnColor = (data) => {
  // tableRowClassName=data;
  // console.log(tableRowClassName)
}
  
const Expose = (method, data, multiple = false) => {
  if(method=="multiplefilterChange"){
    multiplefilterChange(data);
  }
  if (method == 'filterChange') {
  
    // let key = Object.keys(data)[0];
    // let value = data[key];
    Object.keys(data).forEach(i => {
      let key=i;
      let value = data[i];
      filterChange(key, value, multiple)
    })
   
  }
  if (method == 'setFilterLabel') {
    let key = Object.keys(data)[0];
    let value = data[key];
    setFilterLabel(key, value)
  }
  if (method == 'closeLoading') {
    closeLoading(data)
  }
  if (method == 'closeHeightlight') {
    closeHeightlight(data)
  }
  if (method == 'openLoading') {
    openLoading(data)
  }

  if (method == 'clearFilter') {
    clearFilter();
  }
  if (method == 'setColumnColor') {
    setColumnColor(data);
  }
  if (method == 'setFilterDisable') {
    setFilterDisable(data);
  }
}

defineExpose({
  Expose
})

</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-table .danger-row {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

.sortClass {
    display:inline;
    flex-direction:column;
    align-items: center;
    margin-top:5px;
    height: 14px;
    width: 24px;
    vertical-align:middle;
    cursor: pointer;
    overflow:initial;
    position:relative;
    
}
</style>