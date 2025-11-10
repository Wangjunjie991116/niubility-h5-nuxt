import type { Ref } from 'vue';

/**
 * 带加载状态的请求 Composable
 * 自动管理 loading 状态
 *
 * @example
 * ```ts
 * const { loading, data, error, execute } = useRequest(
 *   () => api.get('/api/users'),
 *   { immediate: true }
 * );
 * ```
 */
export const useRequest = <T = any>(
	requestFn: () => Promise<T>,
	options?: {
		immediate?: boolean;
		onSuccess?: (data: T) => void;
		onError?: (error: Error) => void;
	}
) => {
	const loading = ref(false);
	const data = ref<T | null>(null) as Ref<T | null>;
	const error = ref<Error | null>(null);

	const execute = async () => {
		loading.value = true;
		error.value = null;

		try {
			const result = await requestFn();
			data.value = result;
			options?.onSuccess?.(result);
			return result;
		} catch (err) {
			const errorObj = err instanceof Error ? err : new Error(String(err));
			error.value = errorObj;
			options?.onError?.(errorObj);
			throw errorObj;
		} finally {
			loading.value = false;
		}
	};

	if (options?.immediate) {
		execute();
	}

	return {
		loading: readonly(loading),
		data: readonly(data),
		error: readonly(error),
		execute,
		refresh: execute,
	};
};

/**
 * 分页请求 Composable
 *
 * @example
 * ```ts
 * const pagination = usePagination(
 *   async ({ page, pageSize }) => {
 *     const response = await api.get('/api/users', {
 *       params: { page, pageSize }
 *     });
 *     return {
 *       list: response.list || [],
 *       total: response.total || 0,
 *       page,
 *       pageSize,
 *     };
 *   },
 *   { pageSize: 10, immediate: true }
 * );
 * ```
 */
export const usePagination = <T = any>(
	requestFn: (params: { page: number; pageSize: number }) => Promise<{
		list: T[];
		total: number;
		page: number;
		pageSize: number;
	}>,
	options?: {
		pageSize?: number;
		immediate?: boolean;
	}
) => {
	const page = ref(1);
	const pageSize = ref(options?.pageSize || 10);
	const total = ref(0);
	const list = ref<T[]>([]) as Ref<T[]>;
	const loading = ref(false);

	const loadData = async (reset = false) => {
		if (reset) {
			page.value = 1;
			list.value = [];
		}

		loading.value = true;
		try {
			const result = await requestFn({
				page: page.value,
				pageSize: pageSize.value,
			});
			list.value = reset ? result.list : [...list.value, ...result.list];
			total.value = result.total;
		} catch (err) {
			console.error('分页请求失败:', err);
		} finally {
			loading.value = false;
		}
	};

	const loadMore = () => {
		if (loading.value || list.value.length >= total.value) {
			return;
		}
		page.value++;
		loadData(false);
	};

	const refresh = () => {
		loadData(true);
	};

	if (options?.immediate) {
		loadData(true);
	}

	return {
		page: readonly(page),
		pageSize: readonly(pageSize),
		total: readonly(total),
		list: readonly(list),
		loading: readonly(loading),
		loadMore,
		refresh,
		loadData,
	};
};
