import request from "../utils/request";

export function GetRolePageList(params) {
    return request.postJSON('/sysroles/GetPageList',params);
}

export function getRoleAllList() {
    return request.get('/role/getRoleAllList');
}

export function grantPermission(params){
    return request.postJSON('/sysroles/grantPermissions', params);
}

export function AddRole(params){
    return request.postJSON('/sysroles/add', params);
}

export function DeleteRole(params){
    return request.postJSON('/sysroles/delete', params);
}

export function RealDeleteRole(params){
    return request.postJSON('/sysroles/realdelete', params);
}

export function UpdateRole(params){
    return request.postJSON('/sysroles/update', params);
}

