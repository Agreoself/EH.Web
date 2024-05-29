import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module='atdholidaySetting';

class HolidaySetting extends BaseCRUD {
    constructor() {
      super(module);
    }

    getHoliday(params){
      return request.get('/'+module+'/getHoliday', params);
    } 

    saveHoliday(params){
      return request.postJSON('/'+module+'/saveHoliday', params);
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

export {HolidaySetting} 

