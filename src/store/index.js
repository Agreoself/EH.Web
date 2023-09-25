import createPersistedState from 'vuex-persistedstate';
import { createStore, createLogger } from 'vuex';
import getters from './getters'

import tab from './module/tab'
import user from "./module/user";
import menu from "./module/menu";
import process from "./module/process";

// const files = require.context('./module', false, /\.js$/)

// const modules = {}
// files.keys().forEach((key) => {
//   modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
// })
// Object.keys(modules).forEach((key) => {
//   modules[key]['namespaced'] = true
// })

const files = import.meta.glob('./module/*.js')
const modules = {}
Object.keys(files).forEach((key) => {

  const module = files[key];
  // console.log(module)

  const moduleName = key.replace(/(\.\/|\.js)/g, '');
  // console.log(moduleName)
  modules[moduleName] = module;
  modules[moduleName].namespaced = true;

  // modules[key.replace(/(\.\/|\.js)/g, '')] = files[key].default
  // const module = files[key];
  // console.log(module)
  // if (module && module.default) {
  //   console.log(1)
  //   const moduleName = key.replace(/(\.\/|\.js)/g, '');
  //   console.log(moduleName)
  //   modules[moduleName] = module.default;
  //   modules[moduleName].namespaced = true;
  // }
  // modules[key.replace(/(\.\/|\.js)/g, '')] = files[key].default
})

// console.log(modules)

// Object.keys(modules).forEach((key) => {
//   modules[key]['namespaced'] = true
// })

const debug = process.env.NODE_ENV !== 'production'

export const store = createStore({
  modules: {
    tab, user, menu, process
  },
  getters,
  strict: debug,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    paths: ['user']
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