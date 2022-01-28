import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; 

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps:{ 
    exclude: ["mars3d-cesium"]
  },
  plugins: [
    vue(), 
  ],
});
