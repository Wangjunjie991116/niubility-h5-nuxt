/**
 * useFetch 的二次封装
 * 提供内置的基本配置，同时支持外部传入配置进行覆盖
 * 默认不设置 key，确保每次请求都是新的请求
 */

/**
 * 默认请求配置
 */
const getDefaultOptions = () => ({
	method: 'GET' as const,
	headers: {
		'Content-Type': 'application/json',
	},
	onRequestError({ error: err }: { error: any }) {
		console.error('[useFetchApi] 请求错误:', err);
	},
	onResponseError({ response }: { response: any }) {
		console.error('[useFetchApi] 响应错误:', response);
	},
});

/**
 * 封装的 useFetch Hook
 * @param url - 请求 URL（可以是字符串或通过 API_URLS 获取的完整 URL）
 * @param options - 外部传入的配置，会与默认配置合并，外部配置优先级更高
 *                  默认不设置 key，确保每次请求都是新的请求
 *                  如果需要缓存，可以手动指定 key
 * @returns useFetch 的返回值
 *
 * @example
 * ```ts
 * // 基础用法（每次都是新请求）
 * const { data, pending, error, refresh } = await useFetchApi(
 *   API_URLS.BING_IMAGE_ARCHIVE
 * );
 *
 * // 自定义配置（如果需要缓存，可以手动指定 key）
 * const { data } = await useFetchApi(
 *   API_URLS.BING_IMAGE_ARCHIVE,
 *   {
 *     key: 'custom-key', // 如果需要缓存，可以手动指定
 *     method: 'POST',
 *     body: { foo: 'bar' },
 *   }
 * );
 * ```
 */
export function useFetchApi<T = any>(url: Parameters<typeof useFetch>[0], options?: Parameters<typeof useFetch<T>>[1]) {
	// 获取默认配置
	const defaultOptions = getDefaultOptions();

	// 合并默认配置和外部配置，外部配置优先级更高，不自动设置 key，确保每次请求都是新的请求， 如果外部需要缓存，可以手动指定 key
	const mergedOptions = {
		...defaultOptions,
		...options,
		// 深度合并 headers
		headers: {
			...defaultOptions.headers,
			...(options?.headers || {}),
		},
		// 错误处理：如果外部提供了，使用外部的，否则使用默认的
		onRequestError: options?.onRequestError || defaultOptions.onRequestError,
		onResponseError: options?.onResponseError || defaultOptions.onResponseError,
	};

	return useFetch<T>(url, mergedOptions as any);
}
