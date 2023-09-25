import request from "../utils/request";

export function login(params) {
    return request.postJSON('/sysusers/login',params)
}

export function getUserInfo(params) {
    return request.get('/sysusers/getUserInfo',params);
}

export function logout() {
    return request.get('/sysusers/logout');
}

export function deleteUser(params) {
    return request.get('/sysusers/deleteUser',params);
}


export function updateUser(file,params) {
    return request.uploadFile('/sysusers/updateUser1',file,params);
}

export function ModifyUser(params) {
    return request.postJSON('/sysusers/Update',params);
}

 
export function addUser(file,params) {
    return request.uploadFile('/sysusers/add',file,params);
}

export function grantRole(params) {
    return request.postJSON('/sysusers/grantRole',params);
}

export function GetUserPageList(params) {
    return request.postJSON('/sysusers/GetPageList',params);
}

export function GetUserListInRole(params) {
    return request.postJSON('/sysusers/GetUserListInRole',params);
}
