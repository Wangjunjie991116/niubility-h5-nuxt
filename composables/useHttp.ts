import type { UseFetchOptions, AsyncDataOptions } from '#app';
import type { NitroFetchRequest } from 'nitropack';

/**
 * 基于 useFetch 和 useAsyncData 封装的 HTTP 方法 Hooks
 * 提供统一的请求接口，支持 SSR 和 CSR
 */

/**
 * 默认请求配置
 */
const getDefaultOptions = () => ({
	headers: {
		'Content-Type': 'application/json',
	},
	// 错误处理
	onRequestError({ error: err }: { error: any }) {
		console.error('[useHttp] 请求错误:', err);
	},
	onResponseError({ response }: { response: any }) {
		console.error('[useHttp] 响应错误:', response);
	},
});

/**
 * GET 请求 Hook（基于 useFetch，支持 SSR）
 * @param url - 请求 URL
 * @param options - 请求配置
 * @returns useFetch 的返回值
 */
export function useGet<T = any>(
	url: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
	options?: UseFetchOptions<T, any>
) {
	const defaultOptions = getDefaultOptions();

	const mergedOptions: UseFetchOptions<T, any> = {
		method: 'GET',
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions.headers,
			...(options?.headers || {}),
		},
		onRequestError: options?.onRequestError || defaultOptions.onRequestError,
		onResponseError: options?.onResponseError || defaultOptions.onResponseError,
	};

	return useFetch<T>(url, mergedOptions as any);
}

/**
 * POST 请求 Hook（基于 useFetch，支持 SSR）
 * @param url - 请求 URL
 * @param body - 请求体
 * @param options - 请求配置
 * @returns useFetch 的返回值
 */
export function usePost<T = any>(
	url: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
	body?: any,
	options?: UseFetchOptions<T, any>
) {
	const defaultOptions = getDefaultOptions();

	const mergedOptions: UseFetchOptions<T, any> = {
		method: 'POST',
		body,
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions.headers,
			...(options?.headers || {}),
		},
		onRequestError: options?.onRequestError || defaultOptions.onRequestError,
		onResponseError: options?.onResponseError || defaultOptions.onResponseError,
	};

	return useFetch<T>(url, mergedOptions as any);
}

/**
 * PUT 请求 Hook（基于 useFetch，支持 SSR）
 * @param url - 请求 URL
 * @param body - 请求体
 * @param options - 请求配置
 * @returns useFetch 的返回值
 */
export function usePut<T = any>(
	url: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
	body?: any,
	options?: UseFetchOptions<T, any>
) {
	const defaultOptions = getDefaultOptions();

	const mergedOptions: UseFetchOptions<T, any> = {
		method: 'PUT',
		body,
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions.headers,
			...(options?.headers || {}),
		},
		onRequestError: options?.onRequestError || defaultOptions.onRequestError,
		onResponseError: options?.onResponseError || defaultOptions.onResponseError,
	};

	return useFetch<T>(url, mergedOptions as any);
}

/**
 * PATCH 请求 Hook（基于 useFetch，支持 SSR）
 * @param url - 请求 URL
 * @param body - 请求体
 * @param options - 请求配置
 * @returns useFetch 的返回值
 */
export function usePatch<T = any>(
	url: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
	body?: any,
	options?: UseFetchOptions<T, any>
) {
	const defaultOptions = getDefaultOptions();

	const mergedOptions: UseFetchOptions<T, any> = {
		method: 'PATCH',
		body,
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions.headers,
			...(options?.headers || {}),
		},
		onRequestError: options?.onRequestError || defaultOptions.onRequestError,
		onResponseError: options?.onResponseError || defaultOptions.onResponseError,
	};

	return useFetch<T>(url, mergedOptions as any);
}

/**
 * DELETE 请求 Hook（基于 useFetch，支持 SSR）
 * @param url - 请求 URL
 * @param options - 请求配置
 * @returns useFetch 的返回值
 */
export function useDelete<T = any>(
	url: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
	options?: UseFetchOptions<T, any>
) {
	const defaultOptions = getDefaultOptions();

	const mergedOptions: UseFetchOptions<T, any> = {
		method: 'DELETE',
		...defaultOptions,
		...options,
		headers: {
			...defaultOptions.headers,
			...(options?.headers || {}),
		},
		onRequestError: options?.onRequestError || defaultOptions.onRequestError,
		onResponseError: options?.onResponseError || defaultOptions.onResponseError,
	};

	return useFetch<T>(url, mergedOptions as any);
}

/**
 * GET 请求 Hook（基于 useAsyncData，仅客户端，支持 CSR）
 * @param url - 请求 URL
 * @param options - 请求配置
 * @returns useAsyncData 的返回值
 */
export function useGetClient<T = any>(
	url: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
	options?: AsyncDataOptions<T>
) {
	const defaultOptions = getDefaultOptions();

	// 处理 URL 参数，支持字符串、Ref 或函数
	const urlValue = typeof url === 'function' ? url() : unref(url);

	return useAsyncData<T>(
		() =>
			$fetch<T>(urlValue, {
				method: 'GET',
				...defaultOptions,
				headers: {
					...defaultOptions.headers,
				},
			}),
		{
			server: false, // 只在客户端执行
			...options,
		}
	);
}

/**
 * POST 请求 Hook（基于 useAsyncData，仅客户端，支持 CSR）
 * @param url - 请求 URL
 * @param body - 请求体
 * @param options - 请求配置
 * @returns useAsyncData 的返回值
 */
export function usePostClient<T = any>(
	url: NitroFetchRequest | Ref<NitroFetchRequest> | (() => NitroFetchRequest),
	body?: any,
	options?: AsyncDataOptions<T>
) {
	const defaultOptions = getDefaultOptions();

	// 处理 URL 参数，支持字符串、Ref 或函数
	const urlValue = typeof url === 'function' ? url() : unref(url);

	return useAsyncData<T>(
		() =>
			$fetch<T>(urlValue, {
				method: 'POST',
				body,
				...defaultOptions,
				headers: {
					...defaultOptions.headers,
				},
			}),
		{
			server: false, // 只在客户端执行
			...options,
		}
	);
}
