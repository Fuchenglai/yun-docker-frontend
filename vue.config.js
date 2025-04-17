const {defineConfig} = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = defineConfig({
    transpileDependencies: true,
    //关闭eslint检查
    lintOnSave: false,
    chainWebpack(config) {
        config.plugin("monaco").use(new MonacoWebpackPlugin());
    },
    //配置跨域
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://localhost:8088',
                ws: false,
                changeOrigin: true
            },
        }
    }
});
