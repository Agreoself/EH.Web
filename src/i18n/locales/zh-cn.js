import enTrans from "./en"
 
const getTrans=()=>{
  let cnTrans={};
  Object.keys(enTrans).forEach(i=>{
    cnTrans[i]=i;
  });
  return cnTrans;
}
let cnTrans= getTrans();
 
export default cnTrans;
// {
//  //menu and process and breadcrumb
//   "首页": "首页",
//   "考勤管理": "考勤管理",
//   "我的休假": "我的休假",
//   "休假审批": "休假审批",
//   "查询统计":"查询统计",
//   "假期管理": "假期管理",
//   "假期设置": "假期设置",
//   "假日设置": "假日设置",
//   "系统管理": "系统管理",
//   "菜单管理": "菜单管理",
//   "用户管理": "用户管理",
//   "角色管理": "角色管理",
//   "字典管理": "字典管理",
//   "其他相关": "其他相关",

//   //button
//   "编辑": "编辑",
//   "删除": "删除",
//   "新增": "新增",

//   "设置用户": "设置用户",
//   "同步用户": "同步用户",
//   "分配角色": "分配角色",
//   "分配权限": "分配权限",

//   "查看流程": "查看流程",
//   "申请休假": "申请休假",
//   "审核": "审核",
//   "计算年假及病假": "计算年假及病假",
//   "事假计算": "事假计算",
//   "清空年假": "清空年假",
//   "延期年假": "延期年假",
//   "申请育儿假": "申请育儿假",

//   "保存":"保存",
//   "刷新":"刷新",

//   //global
//   "筛选": "筛选",
//   "创建人": "创建人",
//   "创建时间": "创建时间",
//   "更新人": "更新人",
//   "更改人":"更改人",
//   "更新时间": "更新时间",
//   "描述": "描述",
//   "是": "是",
//   "否": "否",
//   "用户名称":"用户名称",
//   "部门":"部门",
//   "备注":"备注",

//   "员工":"员工",
//   "男员工":"男员工",
//   "男":"男",
//   "女员工":"女员工",
//   "女":"女",
//   "启用":"启用",
//   "禁用":"禁用",
//   "组件":"组件",
//   "目录":"目录",

//   "超级管理员":"超级管理员",
//   "HR":"HR",
//   "普通用户":"普通用户",
//   "退出":"退出",

//   //leave
//   "请假单号": "请假单号",
//   "请假类型": "请假类型",
//   "开始时间": "开始时间",
//   "结束时间": "结束时间",
//   "请假小时": "请假小时",
//   "原因": "原因",
//   "附件": "附件",
//   "当前状态": "当前状态",
//   "是否销假": "是否销假",

//   "假期类型": "假期类型",
//   "资格": "资格",
//   "限额": "限额",
//   "最小单位": "最小单位",
//   "HR需审批":"HR需审批",
//   "是否含节假日": "是否含节假日",
//   "计算表达式": "计算表达式",

//   "类别":"类别",
//   "总数":"总数",
//   "可用":"可用",
//   "已用":"已用",
//   "待批":"待批",
//   "延期":"延期",

//   "年假":"年假","事假":"事假","病假":"病假","产假":"产假","婚假":"婚假","陪产假":"陪产假","育儿假":"育儿假","哺乳假":"哺乳假","产检假":"产检假","流产假":"流产假","丧假":"丧假",
//   "一":"一","二":"二","三":"三","四":"四","五":"五","六":"六","日":"日",
//   "一月":"一月","二月":"二月","三月":"三月","四月":"四月","五月":"五月","六月":"六月","七月":"七月","八月":"八月","九月":"九月","十月":"十月","十一月":"十一月","十二月":"十二月",

//   "申请单号":"申请单号",
//   "出生日期":"出生日期", 

//   "已提交":"已提交",
//   "审批中":"审批中",
//   "已通过":"已通过",
//   "仅保存":"仅保存",
//   "未通过":"未通过",

//    //system
//    "邮箱":"邮箱",
//    "状态":"状态",
//    "抄送":"抄送",
//    "全称":"全称",
//    "性别":"性别",
//    "开始工作时间":"开始工作时间",
//    "入司时间":"入司时间",
//    "职务":"职务",
//    "上级":"上级",
//    "最终上级":"最终上级",
 
//    "菜单名称":"菜单名称",
//    "菜单类型":"菜单类型",
//    "父菜单ID":"父菜单ID",
//    "路由名称":"路由名称",
//    "路由路径":"路由路径",
//    "组件路径":"组件路径",
//    "图标":"图标", 
//    "排序":"排序",
 
//    "角色名称":"角色名称",
//    "角色Key":"角色Key",
 
//    "字典名称":"字典名称",
//    "字典编码":"字典编码",
//    "字典描述":"字典描述",
//    "项文本":"项文本",
//    "项值":"项值",
//    "父节点id":"父节点id",

//  //homepage
//   "EHC-HR-12-04 假期管理规定:":"EHC-HR-12-04 假期管理规定:",
//   "三天（不含）以下的休假由部门经理及主管批准，三天（含）以上须部门副总裁批准。":"三天（不含）以下的休假由部门经理及主管批准，三天（含）以上须部门副总裁批准。",
//   "部门主管、经理及以上人员申请休假须由其上级主管批准。":"部门主管、经理及以上人员申请休假须由其上级主管批准。",
//   "三天（不含）以下的休假须提前一天申请，三天（含）以上十天（不含）以下的须提前七天申请，十天（含）以上的休假须提前一个月申请并须提前一周报备人力资源部。若遇特殊情况，有突发事件无法提前申请，必须在得知突发事件当时先电话与其主管口头请假，并于回公司上班后立即填写正式申请单，获得所须批准签字后报送人力资源部。":"三天（不含）以下的休假须提前一天申请，三天（含）以上十天（不含）以下的须提前七天申请，十天（含）以上的休假须提前一个月申请并须提前一周报备人力资源部。若遇特殊情况，有突发事件无法提前申请，必须在得知突发事件当时先电话与其主管口头请假，并于回公司上班后立即填写正式申请单，获得所须批准签字后报送人力资源部。",
//   "请假开始和结束时间请统一按公司规定上班时间（8:30-12:00, 13:00-17:30）填写。":"请假开始和结束时间请统一按公司规定上班时间（8:30-12:00, 13:00-17:30）填写。",
//   "CS等部门需要上夜班的员工，可以把夜班时间换算成白天时间来填写，而在 Reason 一栏中注明实际的夜班请假时间。":"CS等部门需要上夜班的员工，可以把夜班时间换算成白天时间来填写，而在 Reason 一栏中注明实际的夜班请假时间。",
  
//   "需要审批":"需要审批",
//   "草稿假单":"草稿假单",
//   "提交假单":"提交假单",
//   "审批中假单":"审批中假单",
//   "未通过假单":"未通过假单",
// };
