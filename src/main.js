import { createApp } from 'vue'
import App from './App.vue'
import { bootstrap } from "./bootstrap";
  
// import 'normalize.css';
import 'element-plus/dist/index.css';
import './assets/scss/reset.scss'; //全局样式 
import "nprogress/nprogress.css";

import { generateDynamicRoutes } from '@/router';
import { useRouter } from "vue-router";

const app = createApp(App);
// import * as ElementPlusIconsVue from '@element-plus/icons-vue' 

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }

bootstrap({ app }).then(async ({ router }) => {
    router.isReady().then(() => app.mount("#app"));
});



// app.use(router);
// app.use(elementplus);
// app.use(store);
// // app.render= h => h(App);
// app.mount('#app')



