import request from "../utils/request";

export function GetMenuListByUser() {
    return request.get('/sysmenus/GetMenuListByUser');
}
 
export function GetMenuPageList(params) {
    return request.postJSON('/sysmenus/GetPageList',params);
}

export function GetParentMenuList(){
    return request.get('/sysmenus/GetParentMenuList');
}

export function GetAllMenus(){
    return request.get('/sysmenus/GetAllMenus');
}

export function AddMenu(params){
    return request.postJSON('/sysmenus/Add', params);
}

export function UpdateMenu(params) {
    return request.postJSON('/sysmenus/Update',params);
}

export function DeleteMenu(params) {
    return request.postJSON('/sysmenus/RealDelete',params);
}
