/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "icons/icon-192x192.png", "icons/icon-512x512.png"],
            manifest: {
                name: "Rank Pilot",
                short_name: "Rank Pilot",
                description: "Monitor your keyword rankings and SEO performance.",
                theme_color: "#09090b", // Background color of dark theme
                background_color: "#09090b",
                display: "standalone",
                icons: [
                    {
                        src: "icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable"
                    }
                ]
            }
        })
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
        isolate: false,
        pool: 'vmThreads',
    }
});
