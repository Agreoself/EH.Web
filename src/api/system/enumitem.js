import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module = "sysenumitems";
class EnumItem extends BaseCRUD {
    constructor() {
        super(module)
    } 

}

 

// export function getRoleAllList() {
//     return request.get('/role/getRoleAllList');
// }

// export function grantPermission(params) {
//     return request.postJSON('/sysroles/grantPermissions', params);
// }

export {EnumItem}

