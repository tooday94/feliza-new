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
    // Используем esbuild для быстрой минимизации
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Ручное разделение на чанки (файлы)
        manualChunks(id) {
          // Если код лежит в папке node_modules (библиотеки)
          if (id.includes('node_modules')) {
            // 1. Ant Design - очень тяжелый, отделяем его
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd';
            }
            // 2. React и его ядро - отдельно
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            // 3. Иконки - тоже отдельно (их много)
            if (id.includes('react-icons')) {
              return 'icons';
            }
            // 4. Остальные библиотеки - в общий vendor
            return 'vendor';
          }
        },
      },
    },
    // Увеличиваем лимит предупреждения (чтобы консоль не ругалась на файлы >500kb)
    chunkSizeWarningLimit: 1600,
  },
});
