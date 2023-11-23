import request from "@/utils/request";
import { BaseCRUD } from '@/api/base';

const module = 'sysmenus';

class Menu extends BaseCRUD {
  constructor() {
    super(module);
  }

  GetMenuListByUser() {
    return request.get('/sysmenus/GetMenuListByUser');
  }


  GetParentMenuList() {
    return request.get('/sysmenus/GetParentMenuList');
  }

  GetAllMenus() {
    return request.get('/sysmenus/GetAllMenus');
  }

  GetMenuListByRole(params) {
    return request.get('/sysmenus/GetMenuListByRole', params);
  }

  GetMenuByRole(params) {
    return request.get('/sysmenus/GetMenuByRole', params);
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

export { Menu }

