const esbuild = require("esbuild");

esbuild
	.build({
		entryPoints: ["src/index.ts"],
		outfile: "dist/index.js",
		bundle: true,
		platform: "node",
		target: "es2022",
		sourcemap: true,
		external: ["aws-sdk"],
	})
	.catch(() => process.exit(1));
