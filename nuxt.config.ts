// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			charset: 'UTF-8',
			viewport: 'width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1',
			title: 'home',
			meta: [{ name: 'description', content: 'home' }],
		},
	},
	// 路由规则配置
	routeRules: {
		'/demo1': { ssr: true }, // demo1 使用服务端渲染（SSR）
		'/demo2': { ssr: false }, // demo2 使用客户端渲染（CSR）
		// 代理配置：将 /api/bing 开头的请求代理到 https://cn.bing.com
		// 注意：Nuxt 3 的 routeRules.proxy 会自动去掉匹配的前缀
		'/api/bing/**': {
			proxy: 'https://cn.bing.com/**',
		},
	},
	modules: [
		'@nuxt/eslint', // nuxt3 推荐 eslint 规则
		'@nuxt/scripts', // nuxt3 引入三方库 适配包
		'@vant/nuxt', // vant4 适配 nuxt3 工具包, https://github.com/vant-ui/vant-nuxt
		'@pinia/nuxt', // pinia 适配 nuxt3
		'@vueuse/nuxt', // vueuse 适配 nuxt3
	],
	devtools: { enabled: true },
	css: ['~/assets/styles/reset.less', '~/assets/styles/custom.less'],
	postcss: { plugins: { './postcss-px-to-viewport-wrapper.mjs': true } },
	vite: {
		css: { preprocessorOptions: { less: { additionalData: '@import "~/assets/styles/var.less";' } } }, // 预处理器配置
	},
	runtimeConfig: {
		// 私有配置（仅在服务器端可用）
		// 公共配置（在客户端和服务器端都可用）
		public: {
			apiBase: process.env.API_BASE_URL || 'https://cn.bing.com',
			apiTimeout: 10000, // 请求超时时间（毫秒）
		},
	},
});
