import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module = "sysroles";
class Role extends BaseCRUD {
    constructor() {
        super(module)
    }

    getAllRole() {
        return request.get('/sysroles/GetRole');
    }
    
    getRoleByUser(params){ 
        return request.postQuery('/'+module+'/getRoleByUser', params);
    }

    deleteUserRole(params){
        return request.postJSON('/'+module+'/deleteUserRole', params);
    }

    setMenu(params){
        return request.postJSON('/'+module+'/SetMenu', params);
    }

}

 

// export function getRoleAllList() {
//     return request.get('/role/getRoleAllList');
// }

// export function grantPermission(params) {
//     return request.postJSON('/sysroles/grantPermissions', params);
// }

export {Role}

