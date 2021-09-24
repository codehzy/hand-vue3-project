## 手动搭建 vue3 + webpack 5 开发环境
### 1. 配置webpack环境
1. 创建文件夹
```shell
// 创建文件夹
mkdir hand-vue3-project && cd hand-vue3-project
// 初始化项目
npm init -y
```

```shell
yarn add webpack webpack-cli -D
```

```shell
./
mkdir src && cd src && touch main.js

./
touch index.html
touch webpack.config.js
```

2. 配置webpack.config.js内容
```js
// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'development', // 环境模式
  entry: path.resolve(__dirname, './src/main.js'), // 打包入口
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包出口
    filename: 'js/[name].js' // 打包完的静态资源文件名
  }
}
```

修改 package.json的script属性:
```json
"scripts": {
    "dev": "webpack --config ./webpack.config.js"
}
```

我们执行yarn dev来进行打包，并获得成功，这里就不截图了

3. 添加插件
打包完成后发现空的，我们需要给 index.html 来添加内容，然后使用html-webpack-plugin插件将 index.html 来作为模板，打出到 dist 文件夹。

```shell
yarn add html-webpack-plugin
```

修改webpack.config.js
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'), // 我们要使用的 html 模板地址
      filename: 'index.html', // 打包后输出的文件名
      title: '手搭 Vue 开发环境' // index.html 模板内
    })
  ]
}
```

修改index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nice to meet you</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

修改main.js
```js
const root = document.getElementById('root')
root.textContent = 'niceHzy'
```

执行yarn dev进行打包，获得成功。

### 2. 引入 Vue3.x
1. 安装vue3.x
```shell
yarn add vue@next -S
```
2. 在src目录下新建App.vue
```vue
<template>
  <div>我是一个花</div>
</template>

<script>
export default {
}
</script>

<style>
</style>
```
修改main.js，来引入vue
```js
import { createApp } from 'vue' // Vue 3.x 引入 vue 的形式
import App from './App.vue' // 引入 APP 页面组建

const app = createApp(App) // 通过 createApp 初始化 app
app.mount('#root') // 将页面挂载到 root 节点
```

执行 yarn dev 此时发现报错，因为浏览器不认识.vue类型的文件，所以我们需要安装 vue-loader 和 @vue/compiler-sfc。

- vue-loader: 它是基于 webpack 的一个的 loader 插件，解析和转换 .vue  文件，提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template，再分别把它们交给对应的 loader 去处理如 style-loader 、 less-loader 等等，核心的作用，就是 提取 。
- @vue/compiler-sfc： Vue 2.x 时代，需要 vue-template-compiler 插件处理 .vue 内容为 ast ， Vue 3.x 则变成 @vue/compiler-sfc。

> 安装vue-loader的时候，注意使用 yarn add vue-loader@next来安装最新版

3. 修改webpack.config.js内容
```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 最新的 vue-loader 中，VueLoaderPlugin 插件的位置有所改变
const { VueLoaderPlugin } = require('vue-loader/dist/index')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      filename: 'index.html',
      title: '手搭 Vue 开发环境'
    }),
    // 添加 VueLoaderPlugin 插件
    new VueLoaderPlugin()
  ]
}
```

执行 yarn dev，浏览器打开 dist/index.html

4. 如果我们在App.vue文件中加入style内容呢
```vue
<template>
  <div>我是一个花</div>
</template>

<script>
export default {
}
</script>

<style>
div{
  color: yellowgreen;
}
</style>
```

执行 yarn dev 再次报错,提示我们需要css-loader

安装 style-loader 和 css-loader

修改 webpack.config.js
```js
module: {
	rules: [
  	...
    {
      test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
    }
    ...
  ]
}
```

我们再次执行yarn dev就可成功完成打包

> 这里新加一个小插件，用于每次打包前清除之前打包的文件
```shell
yarn add clean-webpack-plugin
```

修改webpack.config.js
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
plugins: [
   new CleanWebpackPlugin()
]
```

### 3. 理解与配置babel
#### babel是什么
以我自己的理解， babel 是把我们随心所欲（最新特性一顿乱写）写的代码，编译成浏览器可识别的代码（低版本浏览器对新特性的支持不友好），就比如上述箭头函数，经过 babel 的转化后，就会变成普通的函数。

#### babel的使用方式
三种使用方式
- 使用单体文件。
- 命令行（babel-cli）。
- 构建工具如 webpack 中的 babel-loader 插件。

> 介绍三个babel依赖
- @babel/core： babel 的核心库。
- @babel/preset-env：它取代了 es2015 es2016 es2017 ，通过配置浏览器版本的形式，将编译的主动权，交给了插件。
- babel-loader： webpack 的 loader 插件，用于编译代码，转化成浏览器读得懂的代码。

安装完成后，我们修改webpack.config.js
```js
module: {
	rules: [
  	{
      test: /\.js$/,
      exclude: /node_modules/, // 不编译node_modules下的文件
      loader: 'babel-loader'
    },
  ]
}
```

在根目录下创建 babel.config.js，并且添加内容
```js
module.exports = {
  presets: [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["last 2 versions"] // 最近 2 个版本的浏览器
      }
    }]
  ]
}
```

给 App.vue添加新的内容,script
```js
<template>
  <div>我是一个花</div>
</template>

<script>
export default {
  setup(){
    const testFunction = () => {
      console.log('vue3 very nice')
    }
    return {
      testFunction
    }
  }
}
</script>

<style>
div{
  color: yellowgreen;
}
</style>
```

执行 yarn dev 完成打包，我们可以在sources中的js/main.js来搜索我们定义的函数，我们会发现刚才定义的箭头函数被转换成了普通的函数。

## 4. 配置 devServer
- 为了解决每次写完代码都需要手动重新打包的痛点，我们引入 webpack-dev-server
  
```shell
yarn add webpack-dev-server -D
```

添加 webpack.config.js的配置
```js
devServer: {
  contentBase: path.resolve(__dirname, './dist'),
  port: 8080,
  publicPath: '/'
}
```

修改 package.json 的运行脚本
```json
"scripts": {
	"dev": "webpack serve --progress --config ./webpack.config.js"
}
```
> 友情提示：如果这里报错，那么代表webpack-cli 和 webpack devServer版本有兼容性问题，可以参考我的package.json文件中的使用版本

### 5.彩蛋
我们可以利用插件来在我们每次修改代码后，热更新我们打包后的index.html，这样就可以实时的看到预览效果。

修改webpack.config.js
```js
const webpack = require('webpack')

// 热更新
new webpack.HotModuleReplacementPlugin()
```