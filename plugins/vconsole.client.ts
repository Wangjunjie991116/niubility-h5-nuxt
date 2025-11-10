// 扩展 Window 接口，添加 VConsole 类型声明
declare global {
	interface Window {
		VConsole?: new () => any;
	}
}

export default defineNuxtPlugin(() => {
	// 在 Nuxt 3 中，使用 import.meta.dev 和 import.meta.client
	// .client.ts 后缀已经确保只在客户端运行，所以可以省略 client 检查
	if (import.meta.dev) {
		// 动态加载 VConsole
		const script = document.createElement('script');
		script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js';
		script.onload = () => {
			if (window.VConsole) {
				new window.VConsole();
			}
		};
		document.head.appendChild(script);
	}
});
