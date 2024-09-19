// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      strapiBaseUri: process.env.STRAPI_BASE_URI || 'http://localhost:1337',
    },
  },
})