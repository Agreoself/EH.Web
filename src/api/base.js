import request from "@/utils/request";

const GetPageList=(module,params) =>{
    return request.postJSON('/'+module+'/GetPageList', params);
}

const Add=(module,params) =>{
    return request.postJSON('/'+module+'/add', params);
}

const Delete=(module,params)=> {
    return request.postJSON('/'+module+'/delete', params);
}

const RealDelete=(module,params)=> {
    return request.postJSON('/'+module+'/realdelete', params);
}

const Update=(module,params)=> {
    return request.postJSON('/'+module+'/update', params);
}

class BaseCRUD {
    constructor(module) {
      this.module = module;
    }

    getPageList(params){
        return GetPageList(this.module,params);
    }

    add(params){
        return Add(this.module,params);
    }

    delete(params){
        return Delete(this.module,params);
    }

    realdelete(params){
        return RealDelete(this.module,params);
    }
    update(params){
        return Update(this.module,params);
    }
}

 
  
export { BaseCRUD }
 