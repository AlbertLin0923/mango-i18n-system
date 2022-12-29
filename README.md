# mango-i18n-system 自动国际化文案配置系统

## 为什么写这个系统

日常前端 web 项目开发中，由于公司项目需要兼容多国语言，项目的代码文案需要提取、收集、整理出来，供翻译人员进行翻译，添加多国语言，经过校对、审核后，导入到项目代码中，此过程往往非常重复繁琐，存在工作效率低，又容易出错的问题。由此结合一些代码解析工具，针对该工作开发了此系统。通过该系统，无需手工提取、收集、整理、录入国际化文案，只需部署好系统，输入系统 Github/GitLab 地址等配置，即可自动化处理以上流程

## 架构

系统架构如图所示：


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2165e2ef0efa45b78b1a90558ceab47b~tplv-k3u1fbpfcp-watermark.image?)

其中，文案解析器结构为


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b66e715926324191be09ead7d771d9d3~tplv-k3u1fbpfcp-watermark.image?)

其系统运行流程是：

1. 翻译人员打开 自动国际化文案配置系统 前端页面
2. 每次系统前端页面进行`刷新`，页面会调用更新源代码接口,通知系统后台进行`业务项目源代码`的拉取和更新
3. 对应地，系统后台执行更新业务项目源代码，使用`文案解析器`对源代码进行解析，读取文案 key 的词条，收集、整理、去重后，同步到数据库
4. 系统后台回传到系统前端页面
5. 翻译人员进行文案的翻译、修改、更新、删除等操作
6. 翻译人员完成翻译工作后，通知到前端开发
7. 前端开发使用辅助插件  [@mango-scripts/i18n-scripts](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-scripts) 进行一键下载、导入语言包到业务系统`本地代码`中

可以看到，这个过程，`作为前端开发，无需参与其中文案的提取工作，从繁杂无聊的文案 key 的提取中解放出来，而最后的文案录入工作，也有辅助插件一键完成`


那么，作为前端开发，只需要在业务项目的初期，部署接入该自动国际化文案配置系统，然后，在需求代码编写中，只需`像写国内的中文项目一样`，文案 key 使用`中文`，每次业务代码完成时，通知翻译人员进行文案翻译，待翻译工作结束后，执行项目辅助脚本，`一键更新`到`本地项目`里面

## 系统预览

以下是系统预览图

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a75cea2398b454496c677b7d00f8133~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7b6180df3a042cf954bec10f7a82213~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21a35462713a433f9e39289b5dc549b1~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5581be1eb5d4355a17a7b8d40ace916~tplv-k3u1fbpfcp-watermark.image?)

## 系统特性

-   自动拉取业务项目源代码
-   自动提取业务项目代码中文文案 key 到系统中
-   支持使用辅助插件  [@mango-scripts/i18n-scripts](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-scripts) 进行一键下载、导入语言包到业务系统`本地代码`中
-   支持操作历史记录查询，方便对文案变更作全流程跟踪
-   支持`正则表达式`、`AST`两种解析方式
-   支持`vue，js，jsx，ts，tsx，svelte`等多种格式文件
-   支持`文案标记模块`，`特殊文案禁用提取`等功能
-   支持文案的excel、json等格式的上传以及下载
-   系统使用文件hash进行`缓存`，提高解析速度，未修改过的业务代码文件不作解析
-   部署方便，使用docker一键部署

## 系统技术栈

- 系统 全栈 采用 typescript 进行编写
- 文案解析器：[@mango-scripts/i18n-utils](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-utils)：基于 babel, vue-template-compiler, hyntax, pug, svelte/compiler 等 对目标源码进行 AST 解析
- 辅助插件：[@mango-scripts/i18n-scripts](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-scripts)：基于 commander，fs-extra，glob，inquirer 等
- 系统前端基于 react@17, react-router@6, redux，rematch, antd, echarts, react-json-view 等
- 系统后台主要采用 nestjs 全家桶 以及 typeorm，execa， exceljs，glob，jsonwebtoken 等
- 数据库方案采用轻量级数据库 splite3
- 项目整体基于 docker，docker-compose 一键部署

## 系统使用

### 如何部署

1. 准备一台公司内部空闲的服务器，下载node及npm，以及谷歌谷歌 zx 插件 [zx](https://github.com/google/zx)

2. 克隆该系统到服务器上一个空闲目录上，例如 `/home/app/i18n/xxx/`, 并切换到该项目根目录上 `cd /home/app/i18n/xxx/mango-i18n-system/`

3. 执行`zx ./scripts/adapt.mjs` ,该文件会修改项目一些配置文件，以适配你的 **项目名称** 及 **端口**

4. 执行 `docker-compose up -d` 进行 docker 一键部署

这时候打开服务器对应的项目端口，例如：http://host:port/register （ host为服务器地址，port为我们刚才设置的端口） 就可以看到项目已经启动

### 如何配置

此时,进入项目地址, 应该能看到项目已经部署好了

1. 登录 http://host:port/register 进行管理员账户的注册,并登录

2. 登录后 进入 `系统配置-人员配置` `系统配置-界面配置` `系统配置-解析配置` 进行项目配置


### 业务系统接入

1. 如上文提到，编码过程需要以 `中文` 作为文案
2. 业务项目 下载脚本包 `pnpm i @mango-scripts/i18n-scripts -D`，
3. 业务项目`package.json`里添加更新指令：

```
  "scripts": {
    "updateLocale": "i18n-scripts updateLocale -f http://xxx:5003/api/locale/get_locale_map -o ./src/locales/common/ -l zh-CN en-US id-ID"
  }

其中

-o 参数为 在业务项目里存储语言包的目录地址
-f 参数为 部署的服务器的地址和端口
-l 参数为 需要下载的语言包列表
```
4. 当需要更新语言包的时候，只需要执行`pnpm run updateLocale`即可

### 更多配置

#### 配置文案模块化

系统支持文案分模块，例如：在目标 `src/views/xxx/index.vue`文件最上面加注释

```
// translateModules:["需求2022009","需求2020102"]
```

系统会自动读取模块信息到系统上，该文件下的所有提取到的中文文案，都将带有属性 `modules:'需求2022009,需求2020102'`，方便在系统前端上进行区分和筛选

#### 关于配置禁用注释

系统会默认忽视业务代码里面的注释，但有些时候，我们一些未被注释的特殊的中文文案 key 并不想出现在自动文案配置系统前端页面上，这时候，我们可以在 `AST 解析模式`下，支持类似`eslint-disable`的注释效果，以注释不需要提取的中文文案 key

```

// 这种注释引擎会忽略整个文件中文文案key的提取，优先级最高
// translate-disable-entire-file

const getFilterStatusMap = (statusMap, type) => {
  if (type === 'pendingCase') {
    return statusMap.filter((i) => {
      return (
        // 这种注释引擎会忽略提取中间包裹的代码段中的中文文案key
        // translate-disable
        i.text === '易烊千玺' ||
        i.text === '张杰'
        // translate-disable
      )
    })
  } else if (type === 'allCase') {
    return statusMap.filter((i) => {
      return (
        // 下面注释引擎会忽略提取 下一行 代码的中文文案key
        // translate-disable-next-line
        i.text === '周杰伦' ||
        i.text === '林俊杰' ||
        i.text === '王力宏'
      )
    })
  } else if (type === 'myCase') {
    return statusMap.filter((i) => {
      return (
        // 下面注释引擎会忽略提取 当前行 代码的中文文案key
        i.text === '林更新' || // translate-disable-line
        i.text === '刘德华'
      )
    })
  }  else {
    return statusMap
  }
}
```

## 源码

项目地址

- [mango-i18n-system](https://github.com/AlbertLin0923/mango-i18n-system)

## TODO List

- 改善部署体验
- 文案解析器支持更多格式的文件



## 参考资料

[Kiwi-国际化全流程解决方案](https://github.com/alibaba/kiwi)

[聊聊前端国际化文案该如何处理](https://juejin.cn/post/6844903778471280653)

[如何快速解决繁杂的国际化替换](https://juejin.im/post/6844903680777388039)

[字节前端如何基于 AST 做国际化重构？](https://toutiao.io/posts/vcb200u/preview)

[astexplorer](https://astexplorer.net/)



[Kiwi-国际化全流程解决方案](https://github.com/alibaba/kiwi)

[聊聊前端国际化文案该如何处理](https://juejin.cn/post/6844903778471280653)

[如何快速解决繁杂的国际化替换](https://juejin.im/post/6844903680777388039)

[字节前端如何基于 AST 做国际化重构？](https://toutiao.io/posts/vcb200u/preview)

[astexplorer](https://astexplorer.net/)