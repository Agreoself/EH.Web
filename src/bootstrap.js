import { loadStore } from '@/store';
import { loadGuards } from '@/router/guards';
import { loadRoutes,loadRouter } from '@/router';
import { loadElementPlusIcons } from '@/plugins/element-plus-icons'
import { loadI18n } from '@/i18n'

// import { loadSvg } from '@/icons';
// import { loadComponents } from '@/components';

import ElementPlus from "element-plus";


export async function bootstrap(options) {
    const { app } = options;

    app.use(ElementPlus)
    loadElementPlusIcons(app)

    const store = loadStore(app)
    const router = loadRouter(app)
 
     loadI18n(app)
    // loadComponents(app)
    // loadSvg()
    // loadDirectives(app)

    // console.log(store)

    await loadRoutes({ store })
    await loadGuards(router);

    return { router }
}