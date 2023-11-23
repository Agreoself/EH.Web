import request from "@/utils/request";
import {BaseCRUD} from '@/api/base';

const module = "sysenumtypes";
class Enum extends BaseCRUD {
    constructor() {
        super(module)
    } 

    getAllDic(){
        return request.get('/sysenumtypes/getalldic');
    }
}

 

// export function getRoleAllList() {
//     return request.get('/role/getRoleAllList');
// }

// export function grantPermission(params) {
//     return request.postJSON('/sysroles/grantPermissions', params);
// }

export {Enum}

