import type { AxiosInstance, AxiosRequestConfig } from "axios";

// 扩展 NuxtApp 类型，添加 $axios
declare module "#app" {
  interface NuxtApp {
    $axios?: AxiosInstance;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $axios?: AxiosInstance;
  }
}

// 扩展 AxiosRequestConfig，添加自定义配置选项
declare module "axios" {
  export interface AxiosRequestConfig {
    // 是否显示加载提示
    showLoading?: boolean;
    // 是否显示错误提示
    showError?: boolean;
    // 是否跳过错误处理
    skipErrorHandler?: boolean;
  }
}

// 导出 API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

// 导出请求方法类型
export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

// 导出请求配置类型
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  skipErrorHandler?: boolean;
}
