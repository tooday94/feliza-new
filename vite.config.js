import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
        
            if (
              id.includes('react') || 
              id.includes('react-dom') || 
              id.includes('react-router-dom') || 
              id.includes('antd') || 
              id.includes('@ant-design')
            ) {
              return 'vendor';
            }
            
            // Только иконки можно безопасно отделить, они ни от чего не зависят
            if (id.includes('react-icons')) {
              return 'icons';
            }

            // Остальные мелкие библиотеки
            return 'libs';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1600,
  },
});
