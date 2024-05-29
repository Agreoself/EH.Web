import { loadStore } from '@/store';
import { loadGuards } from '@/router/guards';
import { loadRoutes,loadRouter } from '@/router';
import { loadElementPlusIcons } from '@/plugins/element-plus-icons'
import { loadI18n } from '@/i18n'
  
// import { loadSvg } from '@/icons';
// import { loadComponents } from '@/components';

import ElementPlus from "element-plus";
import { nextTick } from 'vue';
 
export async function bootstrap(options) {
    const { app } = options; 
    app.use(ElementPlus);
    loadElementPlusIcons(app);
    loadI18n(app);

    const store = loadStore(app);

    await loadRoutes({ store })

    const router = loadRouter(app);
   
    await loadGuards(router);

    return { router }
}