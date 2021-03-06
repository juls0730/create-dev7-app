import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app: {
        head: {
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
        }
    },
    css: [
        '@/assets/css/main.css'
    ],
    // tailwind cssPath stub

    // module stub

    // trpc stub
})
