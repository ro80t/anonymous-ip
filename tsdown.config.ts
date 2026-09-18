import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/hono.ts"],
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  clean: true,
});
