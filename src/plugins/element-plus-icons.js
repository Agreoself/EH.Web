// import * as ElIconModules from '@element-plus/icons'

// export function loadElementPlusIcons(app){
//     for (let key in ElIconModules) {
//         app.component(key,ElIconModules[key])
//     }
// }

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function loadElementPlusIcons(app) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
}

// const app = createApp(App);

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }