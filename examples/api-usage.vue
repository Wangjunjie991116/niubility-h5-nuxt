<template>
	<div class="api-example">
		<h2>Axios API 使用示例</h2>

		<!-- 方式一：直接使用 $axios -->
		<section>
			<h3>1. 直接使用 $axios</h3>
			<button @click="handleDirectAxios">发送请求</button>
			<pre v-if="directData">{{ JSON.stringify(directData, null, 2) }}</pre>
		</section>

		<!-- 方式二：使用 useApi composable -->
		<section>
			<h3>2. 使用 useApi Composable</h3>
			<button @click="handleUseApi">发送请求</button>
			<pre v-if="apiData">{{ JSON.stringify(apiData, null, 2) }}</pre>
		</section>

		<!-- 方式三：使用 useRequest（带加载状态） -->
		<section>
			<h3>3. 使用 useRequest（自动管理加载状态）</h3>
			<button :disabled="requestData.loading.value" @click="requestData.execute">
				{{ requestData.loading.value ? '加载中...' : '发送请求' }}
			</button>
			<pre v-if="requestData.data.value">
        {{ JSON.stringify(requestData.data.value, null, 2) }}
      </pre>
			<p v-if="requestData.error.value" class="error">错误: {{ requestData.error.value.message }}</p>
		</section>

		<!-- 方式四：分页请求 -->
		<section>
			<h3>4. 分页请求示例</h3>
			<button :disabled="pagination.loading.value" @click="pagination.refresh">
				{{ pagination.loading.value ? '加载中...' : '刷新数据' }}
			</button>
			<button :disabled="pagination.loading.value" @click="pagination.loadMore">加载更多</button>
			<p>总数: {{ pagination.total.value }}</p>
			<p>当前页: {{ pagination.page.value }}</p>
			<ul>
				<li v-for="(item, index) in pagination.list.value" :key="index">
					{{ item }}
				</li>
			</ul>
		</section>
	</div>
</template>

<script setup lang="ts">
// 方式一：直接使用 $axios
const { $axios } = useNuxtApp();
const directData = ref(null);

const handleDirectAxios = async () => {
	try {
		const response = await $axios?.get('/api/users', {
			showLoading: true,
			showError: true,
		});
		directData.value = response?.data ?? null;
	} catch (error) {
		console.error('请求失败:', error);
	}
};

// 方式二：使用 useApi composable
const api = useApi();
const apiData = ref(null);

const handleUseApi = async () => {
	try {
		const data = await api.get('/api/users', {
			showLoading: true,
		});
		apiData.value = data;
	} catch (error) {
		console.error('请求失败:', error);
	}
};

// 方式三：使用 useRequest composable（自动管理加载状态）
const requestData = useRequest(() => api.get('/api/users'), {
	immediate: false,
	onSuccess: (data) => {
		console.log('请求成功:', data);
	},
	onError: (error) => {
		console.error('请求失败:', error);
	},
});

// 方式四：分页请求
const pagination = usePagination(
	async ({ page, pageSize }) => {
		// 模拟分页 API 调用
		const response = await api.get('/api/users', {
			params: {
				page,
				pageSize,
			},
		});
		// 假设返回格式为 { list: [], total: 100 }
		return {
			list: response.list || [],
			total: response.total || 0,
			page,
			pageSize,
		};
	},
	{
		pageSize: 10,
		immediate: false,
	}
);
</script>

<style scoped>
.api-example {
	padding: 20px;
}

section {
	margin-bottom: 30px;
	padding: 20px;
	border: 1px solid #eee;
	border-radius: 8px;
}

button {
	padding: 8px 16px;
	margin-right: 10px;
	background: #007bff;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:disabled {
	background: #ccc;
	cursor: not-allowed;
}

pre {
	margin-top: 10px;
	padding: 10px;
	background: #f5f5f5;
	border-radius: 4px;
	overflow-x: auto;
}

.error {
	color: red;
	margin-top: 10px;
}
</style>
