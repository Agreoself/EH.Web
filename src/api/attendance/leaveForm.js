import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module='atdleaveform';

class LeaveForm extends BaseCRUD {
    constructor() {
      super(module);
    }

    getPageListWithState(params){
      return request.postJSON('/'+module+'/getPageListWithState', params);
    }

    queryGetpagelist(params){
      return request.postJSON('/'+module+'/queryGetpagelist', params);
    }

    getHomePageBodyData(params){
      return request.get('/'+module+'/getHomePageBodyData', params);
    }
    
    getHomePageData(params){
      return request.get('/'+module+'/getHomePageData', params);
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

    getStatic(params){
      return request.postJSON('/'+module+'/getStatic', params);
    }

    cancel(params){
      return request.postJSON('/'+module+'/cancel', params);
    }

    treate(params){
      return request.postJSON('/'+module+'/treate', params);
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

