// fun
require("esbuild").buildSync({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: ["node12"],
  outfile: "dist/index.js",
});
