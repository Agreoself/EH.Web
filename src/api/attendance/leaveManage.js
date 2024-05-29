import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module='atdleaveBalance';

class LeaveManage extends BaseCRUD {
    constructor() {
      super(module);
    }
  
    calcuteAnnualAndSick(params){
      return request.postJSON('/'+module+'/calculateannualandsick', params);
    }

    calcutePersonal(params){
      return request.postJSON('/'+module+'/CalculatePersonal', params);
    }

    getInfo(params){
      return request.postJSON('/'+module+'/getInfo', params);
    }

    statistics(params){
      return request.postJSON('/'+module+'/Statistics', params);
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

