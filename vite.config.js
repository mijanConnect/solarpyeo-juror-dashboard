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
    host: true, // allows access from outside (e.g., EC2, domain)
    port: 5175, // dev server port
    allowedHosts: ["juror.glassfile.xyz"], // dev server
  },
  preview: {
    host: true, // allow preview access externally
    port: 4174, // optional, default is 4173
    allowedHosts: ["juror.glassfile.xyz"], // must add host here for preview
  },
});

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "https://juror.glassfile.xyz/",
//     port: 3016,
//   },
// });
