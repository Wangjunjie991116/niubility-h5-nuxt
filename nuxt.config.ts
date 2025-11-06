// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts", // nuxt3 需引入自定义字体所需要的适配包
    "@nuxt/eslint", // nuxt3 推荐 eslint 规则
    "@nuxt/scripts", // nuxt3 引入三方库 适配包
    "@vant/nuxt", // vant4 适配 nuxt3 工具包, https://github.com/vant-ui/vant-nuxt
  ],
  // routeRules: {
  //   "/ddr_status/**": { ssr: true },
  //   "/blog/**": { swr: true },
  //   "/static/**": { static: true },
  //   "/api/**": { headers: { "x-robots-tag": "noindex" } },
  // },
});
