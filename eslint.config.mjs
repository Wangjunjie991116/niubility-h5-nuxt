// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default withNuxt(
	// Prettier 配置 - 必须放在最后，以覆盖其他格式化规则
	{
		plugins: {
			prettier,
		},
		rules: {
			// 启用 Prettier 作为 ESLint 规则
			'prettier/prettier': 'error',
			// 其他自定义规则
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			// 允许使用 any 类型
			'@typescript-eslint/no-explicit-any': 'off',

			// 允许 export let 声明的变量
			'import/no-mutable-exports': 'off',
		},
	},
	// 禁用与 Prettier 冲突的 ESLint 规则
	prettierConfig
);
