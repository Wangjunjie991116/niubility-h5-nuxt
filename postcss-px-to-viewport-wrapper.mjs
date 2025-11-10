// PostCSS 插件包装器，根据文件路径动态选择配置
import pxToViewport from 'postcss-px-to-viewport';

export default function (opts = {}) {
	return {
		postcssPlugin: 'postcss-px-to-viewport-wrapper',
		Once(root, { result }) {
			// 获取当前处理的文件路径
			const file = result.root?.source?.input?.file || result.opts?.from || opts?.file || '';

			// 判断是否为 Vant 组件
			const isVant = file.includes('node_modules/vant') || file.includes('node_modules/@vant');
			// 差异属性配置
			const diffAttrs = {
				viewportWidth: isVant ? 375 : 750,
				exclude: isVant ? undefined : /node_modules/i,
				include: isVant ? /node_modules[\\/]vant/ : undefined,
			};

			// 根据是否是 vant 组件选择不同的配置
			const config = {
				unitPrecision: 5,
				viewportUnit: 'vw',
				fontViewportUnit: 'vw',
				propList: ['*'],
				selectorBlackList: ['.ignore'],
				replace: true,
				mediaQuery: false,
				minPixelValue: 1,
				...diffAttrs,
			};

			// 创建并应用插件
			const plugin = pxToViewport(config);
			return plugin(root, result);
		},
	};
}

export const postcss = true;
