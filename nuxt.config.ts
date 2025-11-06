// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/eslint", "@nuxt/scripts"],
  // routeRules: {
  //   "/ddr_status/**": { ssr: true },
  //   "/blog/**": { swr: true },
  //   "/static/**": { static: true },
  //   "/api/**": { headers: { "x-robots-tag": "noindex" } },
  // },
});
