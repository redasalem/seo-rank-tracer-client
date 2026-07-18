/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
                        return 'vendor-react';
                    }
                    if (id.includes('node_modules/react-router')) {
                        return 'vendor-router';
                    }
                    if (id.includes('node_modules/framer-motion')) {
                        return 'vendor-motion';
                    }
                    if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
                        return 'vendor-i18n';
                    }
                    if (id.includes('node_modules/lucide-react') || id.includes('node_modules/@icons-pack')) {
                        return 'vendor-icons';
                    }
                }
            }
        }
    },
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "icons/icon-192x192.png", "icons/icon-512x512.png"],
            manifest: {
                name: "RankBoost",
                short_name: "RankBoost",
                description: "Monitor your keyword rankings and SEO performance.",
                theme_color: "#09090b", // Background color of dark theme
                background_color: "#09090b",
                display: "standalone",
                icons: [
                    {
                        src: "icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{html,css}', 'assets/index-*.js'],
                maximumFileSizeToCacheInBytes: 500 * 1024,
                runtimeCaching: [
                    {
                        urlPattern: /assets\/.*\.js$/,
                        handler: 'StaleWhileRevalidate'
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
