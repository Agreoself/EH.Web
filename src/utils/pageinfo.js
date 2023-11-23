const buttonInfo = [];

const formInfo = {
    createNew: function () {
        let formInfo={};
        formInfo.layout=[];
        formInfo.gutter= 10; // 表单项之间的间距
        formInfo.labelWidth="110px";
        formInfo.labelPosition= 'right';// 表单标签位置，可选值：'top'、'left'、'right'
        formInfo.rules={};
        formInfo.formData={};
        formInfo.hasButton=false;
        formInfo.buttonInfo=[]; 
    
        formInfo.fields=[];
        return formInfo;
    },
    createFormLayout:function(fields){
        let layout=[];
        fields.forEach(field => {
            let rowIndex = field.row - 1;

            if (!layout[rowIndex]) {
              layout[rowIndex] = [];
            }
          
            layout[rowIndex].push(field);
          
        });

        return layout;
    },

    createFormRule:function(fields){
        let rules={};
        fields.forEach(field => {
            if (field.require) {
                if (!rules[field.prop]) {
                  rules[field.prop] = [];
                }
                rules[field.prop].push({ required: true, message: `${field.label}不能为空`, trigger: 'blur' });
              }
            
              if (field.max) {
                if (!rules[field.prop]) {
                  rules[field.prop] = [];
                }
                rules[field.prop].push({ max: field.max, message: `${field.label}不能超过${field.max}`, trigger: 'blur' });
              }
        });
        return rules;
    }
    
 // #region
    // fields: [
    // //   {
    // //     type: 'input',
    // //     label: '文本字段',
    // //     prop: 'text',
    // //     placeholder: '请输入文本',
    // //     defaultValue: '',
    // //     max:500,
    // //   },
    // //   {
    // //     type: 'number',
    // //     label: '数字字段',
    // //     prop: 'number',
    // //     placeholder: '请输入数字',
    // //     defaultValue: 0,
    // //     max:100,
    // //     min:0,
    // //   },
    // //   {
    // //     type: 'cascader',
    // //     label: '级联选择',
    // //     prop: 'cascader',
    // //     placeholder: '请选择',
    // //     options: [
    // //       {
    // //         value: 'option1',
    // //         label: '选项1'
    // //       },
    // //       {
    // //         value: 'option2',
    // //         label: '选项2',
    // //         children: [
    // //           {
    // //             value: 'option2-1',
    // //             label: '选项2-1'
    // //           },
    // //           {
    // //             value: 'option2-2',
    // //             label: '选项2-2'
    // //           }
    // //         ]
    // //       },
    // //       {
    // //         value: 'option3',
    // //         label: '选项3'
    // //       }
    // //     ],
    // //     defaultValue: [],
    // //     defaultParams:{},
    // //   },
    // //   {
    // //     type: 'time',
    // //     label: '时间字段',
    // //     prop: 'time',
    // //     placeholder: '请选择时间',
    // //     defaultValue: ''
    // //   },
    // //   {
    // //     type: 'switch',
    // //     label: '开关',
    // //     prop: 'switch',
    // //     defaultValue: false
    // //   },
    // //   {
    // //     type: 'radio',
    // //     label: '单选',
    // //     prop: 'radio',
    // //     options: [
    // //       {
    // //         label: '选项1',
    // //         value: 'option1'
    // //       },
    // //       {
    // //         label: '选项2',
    // //         value: 'option2'
    // //       },
    // //       {
    // //         label: '选项3',
    // //         value: 'option3'
    // //       }
    // //     ],
    // //     defaultValue: ''
    // //   },
    // //   {
    // //     type: 'checkbox',
    // //     label: '多选',
    // //     prop: 'checkbox',
    // //     options: [
    // //       {
    // //         label: '选项1',
    // //         value: 'option1'
    // //       },
    // //       {
    // //         label: '选项2',
    // //         value: 'option2'
    // //       },
    // //       {
    // //         label: '选项3',
    // //         value: 'option3'
    // //       }
    // //     ],
    // //     defaultValue: []
    // //   }
    // ]
// #endregion
  };

const tableInfo = {  
    createNew: function (other=0) {
        let tableInfo={};
        tableInfo.height=document.body.offsetHeight-(92+12+20+24+20)-other
        tableInfo.maxHeight =490;
        tableInfo.size = 'default';
        tableInfo.tableLayout = 'auto';
        tableInfo.tableColumn = [];
        tableInfo.tableData = [];
        tableInfo.currentRow = {};
        tableInfo.selectRow = [];
        tableInfo.total = 0;
        tableInfo.pageRequest = {
            pageIndex: 1,
            pageSize: 10,
            where: "",
            order: 'createDate',
            defaultWhere:"",
        };
        tableInfo.pageSizes = [10, 50, 100,500];
        tableInfo.pagerCount = 5;
        tableInfo.pagerSmall = true;
        tableInfo.layout = "total, sizes, prev, pager, next, jumper"

        return tableInfo;
    },
};
 
const page = {
    buttonInfo, formInfo, tableInfo
}



export { page }