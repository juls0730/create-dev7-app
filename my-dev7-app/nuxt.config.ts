// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default {
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

    
                postcss: {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
},
              
            

    modules: [
      'trpc-nuxt',
    ],

    trpc: {
  baseURL: '', // Set empty string (default) to make requests by relative address
  endpoint: '/trpc', // defaults to /trpc
  installPlugin: true, // defaults to true. Add @trpc/client plugin and composables
},
}
