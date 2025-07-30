import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  base: "/", // 本番でルート配信する場合は "/"、サブディレクトリに置く場合は "/subpath/"
  build: {
    outDir: "dist",     // 出力先
    emptyOutDir: true,  // ビルド前にクリア
  },
});
