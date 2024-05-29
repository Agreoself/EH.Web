import request from "@/utils/request";
import { BaseCRUD } from "@/api/base";

const module='sysusers';

class User extends BaseCRUD{
    constructor(){
        super(module);
    }

    login(params) {
        return request.postJSON('/sysusers/login',params)
    }

    getUserInfo(params) {
        return request.get('/sysusers/getUserInfo',params);
    }

    grantRole(params) {
        return request.postJSON('/sysusers/grantRole',params);
    }

    setRole(params) {
        return request.postJSON('/sysusers/SetRole',params);
    }
    
    changePhoto(params) {
        return request.postJSON('/sysusers/changePhoto',params);
    }

    GetUserListInRole(params) {
        return request.postJSON('/sysusers/GetUserListInRole',params);
    }

    getADInfo(params) {
        return request.get('/aduseroperate/getUserbyusername',params);
    }

}

// export function login(params) {
//     return request.postJSON('/sysusers/login',params)
// }

// export function getUserInfo(params) {
//     return request.get('/sysusers/getUserInfo',params);
// }

// export function logout() {
//     return request.get('/sysusers/logout');
// }


// export function GetUserPageList(params) {
//     return request.postJSON('/sysusers/GetPageList',params);
// }

// export function addUser(file,params) {
//     return request.uploadFile('/sysusers/add',file,params);
// }

// export function deleteUser(params) {
//     return request.get('/sysusers/deleteUser',params);
// }

// export function ModifyUser(params) {
//     return request.postJSON('/sysusers/Update',params);
// }
 
// export function updateUser(file,params) {
//     return request.uploadFile('/sysusers/updateUser1',file,params);
// }

 
// export function grantRole(params) {
//     return request.postJSON('/sysusers/grantRole',params);
// }


// export function GetUserListInRole(params) {
//     return request.postJSON('/sysusers/GetUserListInRole',params);
// }

export {User}
