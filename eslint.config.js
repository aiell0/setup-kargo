import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import pluginSecurity from "eslint-plugin-security";

const securityRules = pluginSecurity.configs.recommended.rules ?? {};

export default defineConfig([
	{
		ignores: ["dist/**"],
	},
	js.configs.recommended,
	{
		plugins: {
			security: pluginSecurity,
		},
	},
	{
		files: ["src/**/*.js"],
		languageOptions: {
			sourceType: "module",
		},
		rules: {
			...securityRules,
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
]);

