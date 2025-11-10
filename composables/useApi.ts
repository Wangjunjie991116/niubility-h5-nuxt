import type { AxiosRequestConfig } from "axios";
import type { RequestConfig } from "~/types/axios";

/**
 * API 请求 Composable
 * 提供统一的 API 调用方法
 *
 * @example
 * ```ts
 * const api = useApi();
 * const data = await api.get('/api/users');
 * ```
 */
export const useApi = () => {
  const { $axios } = useNuxtApp();

  if (!$axios) {
    throw new Error(
      "Axios instance not found. Make sure axios plugin is properly configured."
    );
  }

  /**
   * GET 请求
   */
  const get = <T = any>(url: string, config?: RequestConfig): Promise<T> => {
    return $axios.get<T>(url, config).then((response) => response.data as T);
  };

  /**
   * POST 请求
   */
  const post = <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> => {
    return $axios
      .post<T>(url, data, config)
      .then((response) => response.data as T);
  };

  /**
   * PUT 请求
   */
  const put = <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> => {
    return $axios
      .put<T>(url, data, config)
      .then((response) => response.data as T);
  };

  /**
   * DELETE 请求
   */
  const del = <T = any>(url: string, config?: RequestConfig): Promise<T> => {
    return $axios.delete<T>(url, config).then((response) => response.data as T);
  };

  /**
   * PATCH 请求
   */
  const patch = <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> => {
    return $axios
      .patch<T>(url, data, config)
      .then((response) => response.data as T);
  };

  /**
   * 通用请求方法
   */
  const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    return $axios.request<T>(config).then((response) => response.data as T);
  };

  return {
    get,
    post,
    put,
    delete: del,
    patch,
    request,
    // 直接暴露 axios 实例，以便需要时使用
    axios: $axios,
  };
};
