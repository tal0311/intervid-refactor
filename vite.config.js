import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // used to prevent an error when using vue3-quill, see https://github.com/flyween/vue3-quill/issues/9
  // TODO: look into the optimizeDeps option and see if it shoulo be used for other packages
  optimizeDeps: {
    include: ['quill'],
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
