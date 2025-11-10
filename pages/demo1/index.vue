<script setup lang="ts">
// demo1: 使用服务端渲染（SSR）
// 使用封装的 useGet Hook 和 API 配置
import { API } from '~/config/api.config';

// 使用 useGet 发起 GET 请求，支持 SSR
// 设置固定的 key，让服务端和客户端使用相同的缓存 key，避免重复请求
const { data, error, pending, refresh } = await useGet(() => API.BING.IMAGE_ARCHIVE({ format: 'js', n: 5 }), {
	server: true,
	key: 'bing-image-archive',
});

const jump = () => {
	const router = useRouter();
	router.push('/demo2');
};
</script>

<template>
	<div class="demo-container">
		<h1 class="title">Demo1 - 服务端渲染 (SSR)</h1>

		<!-- 加载状态 -->
		<div v-if="pending" class="loading">
			<VanLoading type="spinner" size="24px">加载中...</VanLoading>
		</div>

		<!-- 错误状态 -->
		<div v-else-if="error" class="error">
			<VanEmpty description="请求失败">
				<template #description>
					<p>错误信息: {{ error.message || '未知错误' }}</p>
					<VanButton type="primary" @click="refresh">重试</VanButton>
				</template>
			</VanEmpty>
		</div>

		<!-- 数据展示 -->
		<div v-else-if="data" class="content">
			<h2>接口返回内容：</h2>
			<!-- 如果返回的是 HTML，使用 v-html -->
			<div v-if="typeof data === 'string'" class="html-content" v-html="data"></div>
			<!-- 如果返回的是 JSON，格式化展示 -->
			<pre v-else class="json-content">{{ JSON.stringify(data, null, 2) }}</pre>
		</div>

		<!-- 操作按钮 -->
		<div class="actions">
			<VanButton type="primary" :loading="pending" @click="refresh">刷新数据</VanButton>
			<VanButton type="default" style="margin-left: 12px" @click="jump">跳转到 Demo2</VanButton>
		</div>
	</div>
</template>

<style lang="less" scoped>
.demo-container {
	padding: 16px;

	.title {
		color: #333;
		font-size: 24px;
		margin-bottom: 16px;
		background-color: pink;

		&:hover {
			color: #1890ff;
		}
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40px 0;
	}

	.error {
		padding: 40px 0;
		text-align: center;

		p {
			margin: 16px 0;
			color: #ee0a24;
		}
	}

	.content {
		margin-top: 20px;

		h2 {
			font-size: 18px;
			margin-bottom: 16px;
			color: #333;
		}

		.html-content {
			padding: 16px;
			background-color: #f7f8fa;
			border-radius: 8px;
			overflow-x: auto;
		}

		.json-content {
			padding: 16px;
			background-color: #f7f8fa;
			border-radius: 8px;
			overflow-x: auto;
			font-size: 14px;
			line-height: 1.6;
			color: #333;
		}
	}

	.actions {
		margin-top: 20px;
		text-align: center;
	}

	.error-fallback {
		padding: 40px 0;
		text-align: center;

		p {
			margin: 16px 0;
			color: #ee0a24;
		}
	}

	.fallback-button {
		padding: 8px 16px;
		background-color: #1989fa;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;

		&:hover {
			background-color: #0570c9;
		}
	}
}
</style>
