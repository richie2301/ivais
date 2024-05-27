import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// // import dotenv from 'dotenv';
// // dotenv.config();

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // define: {
//   //   'process.env': {},
//   // },
// })

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
  plugins: [react()],
});


