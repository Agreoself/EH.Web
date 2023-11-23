import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module='atdleaveform';

class LeaveForm extends BaseCRUD {
    constructor() {
      super(module);
    }

    getWatiAuditForm(params){
      return request.postJSON('/'+module+'/getWaitAuditForm', params);
    }

    auditForm(params){
      return request.postJSON('/'+module+'/audit', params);
    }

    updateFP(params){
      return request.postJSON('/'+module+'/updatefp', params);
    }


    save(params){
      return request.postJSON('/'+module+'/save', params);
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

export {LeaveForm} 

