/**
 * API 接口配置
 * 域名和路径分开维护，支持通过 API.[域名].[路径简称] 的方式调用
 */

/**
 * 域名环境配置
 */
interface HostConfig {
	/** 服务端基础 URL（服务端直接使用，无跨域限制） */
	server: string;
	/** 客户端开发环境代理路径前缀 */
	dev: string;
	/** 客户端生产环境基础 URL */
	prod: string;
}

/**
 * API 域名配置
 * 按域名分组，每个域名包含不同环境的配置
 */
const API_HOSTS = {
	/** Bing 域名 */
	BING: {
		server: 'https://cn.bing.com', // 服务端任意
		prod: 'https://cn.bing.com', // 客户端生产
		dev: '/api/bing', // 客户端开发
	},
} as const satisfies Record<string, HostConfig>;

/**
 * API 路径配置
 * 按域名分组，每个域名下包含多个路径
 * 路径不包含 query 参数，query 参数在调用时动态传入
 */
const API_PATHS = {
	/** Bing 域名下的路径 */
	BING: {
		/** 图片获取 */
		IMAGE_ARCHIVE: '/HPImageArchive.aspx',
	},
} as const satisfies Record<keyof typeof API_HOSTS, Record<string, string>>;

/**
 * 根据环境获取完整的 API URL
 * @param hostKey - 域名键名
 * @param path - 接口路径
 * @param query - 查询参数（可选）
 * @returns 完整的 API URL
 */
function getApiUrl(
	hostKey: keyof typeof API_HOSTS,
	path: string,
	query?: Record<string, string | number | boolean>
): string {
	const hostConfig = API_HOSTS[hostKey];

	// 构建查询参数
	let queryString = '';
	if (query && Object.keys(query).length > 0) {
		const params = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => {
			params.append(key, String(value));
		});
		queryString = '?' + params.toString();
	}

	// 服务端：直接使用完整 URL（无跨域限制）
	if (import.meta.server) {
		return `${hostConfig.server}${path}${queryString}`;
	}

	// 客户端：开发环境使用代理路径，生产环境使用完整 URL
	if (import.meta.dev && import.meta.client) {
		return `${hostConfig.dev}${path}${queryString}`;
	}

	return `${hostConfig.prod}${path}${queryString}`;
}

/**
 * API 路径对象（不包含 query 参数）
 * 使用方式：API.BING.IMAGE_ARCHIVE 获取路径字符串
 */
export const API_PATHS_EXPORT = new Proxy({} as Record<keyof typeof API_HOSTS, Record<string, string>>, {
	get(_target, hostKey: keyof typeof API_HOSTS) {
		const paths = API_PATHS[hostKey];
		if (!paths) {
			throw new Error(`API host not found: ${String(hostKey)}`);
		}
		return paths;
	},
});

/**
 * API URL 生成函数
 * 使用方式：API.BING.IMAGE_ARCHIVE({ format: 'js', n: 5 })
 * 根据当前环境自动返回对应的完整 URL
 */
export const API = new Proxy(
	{} as Record<keyof typeof API_HOSTS, Record<string, (query?: Record<string, string | number | boolean>) => string>>,
	{
		get(_target, hostKey: keyof typeof API_HOSTS) {
			const paths = API_PATHS[hostKey];
			if (!paths) {
				throw new Error(`API host not found: ${String(hostKey)}`);
			}

			// 返回该域名下的路径函数对象
			return new Proxy(
				{} as Record<keyof typeof paths, (query?: Record<string, string | number | boolean>) => string>,
				{
					get(_target, pathKey: keyof typeof paths) {
						const path = paths[pathKey];
						if (!path) {
							throw new Error(`API path not found: ${String(hostKey)}.${String(pathKey)}`);
						}
						// 返回一个函数，可以传入 query 参数
						return (query?: Record<string, string | number | boolean>) => getApiUrl(hostKey, path, query);
					},
				}
			);
		},
	}
);
