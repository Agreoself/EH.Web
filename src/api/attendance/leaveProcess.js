import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module='atdleaveprocess';

class LeaveProcess extends BaseCRUD {
    constructor() {
      super(module);
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

export {LeaveProcess} 

