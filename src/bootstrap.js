
import { loadRouter } from '@/router';
import { loadStore } from '@/store';
import { loadGuards } from '@/router/guards';
import { loadRoutes } from '@/router';
import { loadElementPlusIcons } from '@/plugins/element-plus-icons'

// import { loadSvg } from '@/icons';
// import { loadComponents } from '@/components';

import ElementPlus from "element-plus";


export async function bootstrap(options) {
    const { app } = options;

    const store = loadStore(app)
    const router = loadRouter(app)

    app.use(ElementPlus)
    loadElementPlusIcons(app)
    // loadI18n(app)
    // loadComponents(app)
    // loadSvg()
    // loadDirectives(app)

    // console.log(store)

    await loadRoutes({ store })
    await loadGuards(router);

    return { router }
}