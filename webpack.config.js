
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname,'./src/main.js'),
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'js/[name].js'
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:[
                    'vue-loader'
                ]
            },
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'./index.html'),
            filename: 'index.html',
            title: '手搭 Vue 开发环境'
        }),
        // 添加 VueLoaderPlugin 插件
        new VueLoaderPlugin(),
        // 添加 每次打包后清除dist文件 插件
        new CleanWebpackPlugin(),
        // 热更新
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        compress: true,
        port: 8080,
    }
}