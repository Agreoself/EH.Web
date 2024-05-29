import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
// import { message } from '../src/utils/message.js'
// import { page } from '../src/utils/pageinfo.js'


export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },

  plugins: [vue({}),
  AutoImport({
    imports: ['vue', 'vue-router', 'vue-i18n'
      // `import { message } from '../src/utils/message.js'`,
    ]
  }),
  ],
  base: './',

  server: {
    host:'0.0.0.0',
    port: 8088,
    open: true,
    https: false,
    proxy: {
      'api': {
        target: 'https://localhost:5757/',
        changeOrigin: true,
        // pathRewrite:{
        //   '^/api':''
        // }
      },
    }
  },

  devServer: {
    https: false,
    hotOnly: false,
    proxy: {
      'api': {
        target: '',
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  },


})
