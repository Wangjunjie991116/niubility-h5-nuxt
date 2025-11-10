<script setup lang="ts">
// demo2: 使用客户端渲染（CSR）
import { API } from '~/config/api.config';

// 使用 useGetClient 发起 GET 请求，仅在客户端执行（CSR 模式）
const { data, pending, error, refresh } = await useGetClient(API.BING.IMAGE_ARCHIVE({ format: 'js', n: 5 }));
</script>

<template>
	<div class="demo-container">
		<h1 class="title">Demo2 - 客户端渲染 (CSR)</h1>

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

		<!-- 刷新按钮 -->
		<div class="actions">
			<VanButton type="primary" :loading="pending" @click="refresh">刷新数据</VanButton>
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
		background-color: #e3f2fd;

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
