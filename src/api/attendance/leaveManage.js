import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module='atdleaveBalance';

class LeaveManage extends BaseCRUD {
    constructor() {
      super(module);
    }
  
    calcuteAnnualAndSick(params){
      return request.postQuery('/'+module+'/calculateannualandsick', params);
    }
  }

  
// export function GetMenuListByUser() {
//     return request.get('/sysmenus/GetMenuListByUser');
// }
 

// export function GetParentMenuList(){
//     return request.get('/sysmenus/GetParentMenuList');
// }

// export function GetAllMenus(){
//     return request.get('/sysmenus/GetAllMenus');
// }

export {LeaveManage} 

