// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 配置应用头部信息
  app: {
    // 配置应用头部信息
    head: {
      charset: "UTF-8",
      // 配置视口
      viewport:
        "width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1",
      // 配置标题
      title: "home",
      // 配置元信息
      meta: [{ name: "description", content: "home" }],
    },
  },
  // 引入模块
  modules: [
    "@nuxt/fonts", // nuxt3 需引入自定义字体所需要的适配包
    "@nuxt/eslint", // nuxt3 推荐 eslint 规则
    "@nuxt/scripts", // nuxt3 引入三方库 适配包
    "@vant/nuxt", // vant4 适配 nuxt3 工具包, https://github.com/vant-ui/vant-nuxt
    "@pinia/nuxt", // pinia 适配 nuxt3
    "@vueuse/nuxt", // vueuse 适配 nuxt3
  ],
  devtools: { enabled: true },
  // 全局引入样式文件
  css: ["~/assets/styles/reset.less", "~/assets/styles/custom.less"],
  // PostCSS 配置（支持 Vant 组件和项目代码使用不同的设计稿宽度）
  postcss: {
    plugins: {
      // 使用自定义包装器插件，根据文件路径动态选择像素转化
      "./postcss-px-to-viewport-wrapper.mjs": true,
    },
  },
  // 使用 Vite 配置 CSS 预处理器选项
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "~/assets/styles/var.less";',
        },
      },
    },
  },
  // routeRules: {
  //   "/ddr_status/**": { ssr: true },
  //   "/blog/**": { swr: true },
  //   "/static/**": { static: true },
  //   "/api/**": { headers: { "x-robots-tag": "noindex" } },
  // },
});
