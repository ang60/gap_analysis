module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/Sites/gapanalysis/frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "build/chunks/6b9af_7a5d449b._.js",
  "build/chunks/[root-of-the-server]__1d48e543._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/Sites/gapanalysis/frontend/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];