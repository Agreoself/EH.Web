import createPersistedState from 'vuex-persistedstate';
import { createStore, createLogger } from 'vuex';
import getters from './getters' 

import tab from './module/tab'
import app from './module/app'
import user from "./module/user";
import menu from "./module/menu";
import process from "./module/process";
import enums from "./module/enums";
 
 
// const files = import.meta.glob('./module/*.js')
// console.log(files)
// let modules = {}
// Object.keys(files).forEach((key) => {

//   const module = files[key].name;
//   console.log(module)
  

//   // const moduleName = key.replace(/(\.\/|\.js)/g, '');
//   const moduleName = key.split("/").pop().replace('.js','');
//   // console.log(moduleName)
 
//   modules[moduleName] = import(`${module}`);
//   // modules[moduleName].namespaced = true;

//   // modules[key.replace(/(\.\/|\.js)/g, '')] = files[key].default
//   // const module = files[key];
//   // console.log(module)
//   // if (module && module.default) {
//   //   console.log(1)
//   //   const moduleName = key.replace(/(\.\/|\.js)/g, '');
//   //   console.log(moduleName)
//   //   modules[moduleName] = module.default;
//   //   modules[moduleName].namespaced = true;
//   // }
//   // modules[key.replace(/(\.\/|\.js)/g, '')] = files[key].default
// })

let files=import.meta.glob('./module/*.js',{eager:true});
let modules={};
Object.keys(files).forEach((key) => {
  const moduleName = key.split("/").pop().replace('.js','');
  modules[moduleName]=files[key].default;
}); 
// console.log(modules)
  
// const debug = process.env.NODE_ENV !== 'production'

export const store = createStore({
  modules:modules,
  //  {
  //   tab, user, menu, process,enums,app
  // },
  getters,
  // strict: debug,
  plugins: [createPersistedState({
    storage: window.localStorage,
    // paths: ['user']
  })]
})

export function useStore() {
  return store;
}


export function loadStore(app) {
  app.use(store)
  return store;
}

export default store;