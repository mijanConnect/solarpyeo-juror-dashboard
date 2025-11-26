import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "10.10.7.42",
//     port: 3016,
//   },
// });
export default defineConfig({
  plugins: [react()],
  server: {
    host: "https://admin.glassfile.xyz/",
    port: 3016,
  },
});
