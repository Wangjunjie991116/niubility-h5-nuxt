import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '~/types/global';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	// 创建 axios 实例
	const axiosInstance = axios.create({
		baseURL: config.public.apiBase,
		timeout: config.public.apiTimeout,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	// 请求拦截器
	axiosInstance.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			// 从 cookie 获取 token
			const token = useCookie('token').value;
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			// 添加时间戳防止 GET 请求缓存
			if (config.method === 'get' && config.params) {
				config.params._t = Date.now();
			}

			// 开发环境打印请求信息
			if (import.meta.dev) {
				console.log(`[Axios Request] ${config.method?.toUpperCase()} ${config.url}`, {
					params: config.params,
					data: config.data,
				});
			}

			// 显示加载提示（如果需要）
			if (config.showLoading !== false) {
				// 这里可以集成 Vant 的 Toast.loading 或其他加载提示组件
				// import { showLoadingToast } from 'vant';
				// showLoadingToast({ message: '加载中...', forbidClick: true });
			}

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// 响应拦截器
	axiosInstance.interceptors.response.use(
		(response: AxiosResponse<ApiResponse>) => {
			const { data, config } = response;

			// 开发环境打印响应信息
			if (import.meta.dev) {
				console.log(`[Axios Response] ${config.method?.toUpperCase()} ${config.url}`, data);
			}

			// 根据业务逻辑处理响应
			// 如果后端返回的数据结构是 { code, message, data }
			if (data && typeof data === 'object' && 'code' in data) {
				// 假设 code === 200 或 code === 0 表示成功
				if (data.code === 200 || data.code === 0) {
					// 返回 data 字段，如果没有 data 字段则返回整个响应
					return data.data !== undefined ? data.data : data;
				} else {
					// 业务错误
					const error = new Error(data.message || '请求失败');
					return Promise.reject(error);
				}
			}

			// 如果后端直接返回数据，则直接返回
			return data;
		},
		(error: AxiosError<ApiResponse>) => {
			const { response, config } = error;

			// 跳过错误处理
			if (config?.skipErrorHandler) {
				return Promise.reject(error);
			}

			// 开发环境打印错误信息
			if (import.meta.dev) {
				console.error('[Axios Error]', error);
			}

			let errorMessage = '网络请求失败，请稍后重试';

			if (response) {
				// 服务器返回了响应，但状态码不在 2xx 范围内
				const { status, data } = response;

				switch (status) {
					case 400:
						errorMessage = data?.message || '请求参数错误';
						break;
					case 401:
						errorMessage = '未授权，请重新登录';
						// 可以在这里清除 token 并跳转到登录页
						// useCookie('token').value = null;
						// navigateTo('/login');
						break;
					case 403:
						errorMessage = '拒绝访问';
						break;
					case 404:
						errorMessage = '请求的资源不存在';
						break;
					case 500:
						errorMessage = data?.message || '服务器内部错误';
						break;
					case 502:
						errorMessage = '网关错误';
						break;
					case 503:
						errorMessage = '服务不可用';
						break;
					case 504:
						errorMessage = '网关超时';
						break;
					default:
						errorMessage = data?.message || `请求失败 (${status})`;
				}
			} else if (error.request) {
				// 请求已发出，但没有收到响应
				errorMessage = '网络连接失败，请检查网络';
			} else {
				// 在设置请求时发生了错误
				errorMessage = error.message || '请求配置错误';
			}

			// 显示错误提示（如果需要）
			if (config?.showError !== false) {
				// 这里可以集成 Vant 的 Toast.fail 或其他错误提示组件
				// import { showFailToast } from 'vant';
				// showFailToast(errorMessage);
				console.error(errorMessage);
			}

			return Promise.reject(error);
		}
	);

	// 将 axios 实例注入到 NuxtApp 中
	return {
		provide: {
			axios: axiosInstance,
		},
	};
});
