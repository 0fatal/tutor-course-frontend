# course-home

创新实践课程管理系统的个人中心网站

用户可以在该网站内对自己的信息进行管理



## 开发

```shell
npm install

npm run dev

```

## 项目结构说明

```
|------------build          构建脚本目录

    |---------build.js             生产环境构建脚本

    |---------check-version.js 检查node、npm等版本

    |---------dev-client.js     开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新

    |---------dev-server.js     运行本地开发服务器

    |---------utils.js               构建相关工具方法

    |---------vebpack.base.conf.js     webpack基本配置

    |---------vebpack.dev.conf.js       webpack开发环境配置

    |---------vebpack.prod.conf.js     webpack生产环境配置   

|------------config           项目配置

    |---------dev.env.js           开发环境变量

    |---------index.js              项目配置文件

    |---------prod.env.js         生产环境变量

|------------dist             使用生产环境配置构建项目，构建好的目录放到该目录

|------------node_modules         node的依赖包

|------------src
    |---------api                 封装了 axios

    |---------assets                 资源目录，这里的资源会被webpack构建

    |---------components        		组件目录

    |---------directive        		    自定义指令

    |---------i18n					        多语言国际化

    |---------router

    |-----------index.js               前端路由

    |---------utils					全局方法和工具函数

    |---------views					页面文件

    |---------vuex					全局状态管理目录

    |--------App.vue                	根组件

    |--------main.js                 入口js文件

    |--------markData.js                 markdown 初始数据

|------------static             纯静态资源，不会被webpack构建

|------------index.html         入口页面

|------------test        		单元测试

|------------.babelrc            ES6语法编译配置

|-----------.editorconfig      	定义代码格式

|-----------.gitignore         	git 上传需要忽略的文件

|-----------package.json       项目基本信息

---------------------
```

