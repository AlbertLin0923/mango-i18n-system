# mango-i18n-system 自动国际化文案配置系统

## 为什么写这个系统

日常前端 web 项目开发中，对于支持多国语言的业务系统，需要进行前端文案的国际化，此过程需要前端开发人员进行项目文案收集和整理，供翻译人员进行翻译后，再导入到项目代码中。该流程往往非常重复繁琐，存在工作效率低，又容易出错的问题。

由此我结合一些代码解析工具，针对该工作流程开发了此系统。通过该系统，无需手工提取、收集、整理、录入国际化文案，只需部署好系统，输入系统 Github/GitLab 地址等配置，即可自动化处理以上流程。

`更多说明请参考掘金文章`：[前端国际化自动工具-国际化文案配置系统](https://juejin.cn/post/7202082404353228855)

## 架构

系统架构如图所示：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2165e2ef0efa45b78b1a90558ceab47b~tplv-k3u1fbpfcp-watermark.image?)

其中，文案解析器结构为

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b66e715926324191be09ead7d771d9d3~tplv-k3u1fbpfcp-watermark.image?)

其系统运行流程是：

1. 翻译人员打开 自动国际化文案配置系统 前端页面
2. 每当前端页面进行`刷新`，页面会调用接口,通知系统后台进行`业务项目源代码`的拉取和更新
3. 对应地，系统后台执行更新业务项目源代码，并使用`文案解析器`对源代码进行解析，自动读取和收集业务代码的中文文案 key，再经过系统整理、去重后，同步进数据库
4. 系统后台将收集到的`中文文案 key`回传到系统前端页面
5. 翻译人员进行文案的翻译、修改、更新、删除等操作
6. 翻译人员完成翻译工作后，通知到前端开发人员
7. 前端开发人员手动下载已经翻译好的文案json，导入到业务代码里；或者可接入辅助插件 [@mango-scripts/i18n-scripts](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-scripts) 进行一键下载导入

可以看到，这个过程，`作为前端开发，无需参与其中文案的提取工作，从繁杂无聊的文案 key 的提取中解放出来，而最后的文案录入工作，也有辅助插件一键完成`

那么，作为前端开发，只需要在业务项目的初期，部署接入该自动国际化文案配置系统，然后，在需求代码编写中，`就像国内的中文项目一样`，文案 key 使用`中文`，每次业务代码完成时，通知翻译人员进行文案翻译，待翻译工作结束后，执行项目辅助脚本，`一键更新`翻译文案到`本地项目`里面

## 系统预览

以下是系统部分预览图

登录页面

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f26b3985a8a044e6b8f6ef9a74ac595f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3286&h=1826&s=102821&e=png&b=f9fafd)

管理员账号注册页面

> 系统注册默认邀请码：`mango-i18n-system-invitation-code`，可用于管理员账户的注册，可在项目部署前修改

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4c96fa0b1c342cc95f56607d1651a23~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3252&h=1822&s=120923&e=png&b=f9fafd)

文案配置页面

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ac2a396cf6f421faaa512f99e1c54b8~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3332&h=1836&s=266846&e=png&b=fdfdfd)

添加翻译词条

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8f07d07e0fb4c29a926d8121988f6c9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3284&h=1824&s=283795&e=png&b=8a8a8a)

操作记录页面

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24b85698ff7d4dafba5bd3a01a3e41fb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3310&h=1830&s=331656&e=png&b=fdfdfd)

人员配置

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7930be753976465f911075fe78e91cdb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3310&h=1836&s=229576&e=png&b=fefefe)

解析配置

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/121d0348071249c0a115586824b578d3~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3316&h=1828&s=242873&e=png&b=fefefe)

账户设置

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aa2bb13138f48758bb1c3dd2d610ff4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3312&h=1846&s=155409&e=png&b=fafafa)

## 系统特性

- 自动拉取业务项目源代码
- 自动提取业务项目代码`中文文案 key` 到系统中
- 支持使用辅助插件 [@mango-scripts/i18n-scripts](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-scripts) 进行一键下载、导入语言包到业务项目`本地代码`中
- 支持`用户管理`、`操作记录` 等常规后台管理系统功能，方便对文案变更作`全流程跟踪`
- 支持`正则表达式`、`AST`两种解析方式
- 支持`vue、js、jsx、mjs、ts、tsx、mts、svelte`等多种格式文件
- 支持`配置文案模块标识`，`配置无需提取的文案`等功能
- 支持文案的 `excel`、`json` 等格式的上传以及下载
- 系统使用文件 `hash` 进行`缓存`，未修改过的业务代码文件不作解析，提高解析速度
- 部署方便快捷，提供 `docker 镜像`，可使用部署脚本一键部署

## 系统技术栈

- 系统前后端全栈 采用 `TypeScript` 进行编写
- 文案解析器：[@mango-scripts/i18n-utils](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-utils)：基于 babel、vue-template-compiler、hyntax、pug、svelte/compiler 等 对目标源码进行 AST 解析与提取
- 辅助插件：[@mango-scripts/i18n-scripts](https://github.com/AlbertLin0923/mango-scripts/tree/main/packages/i18n-scripts)：基于 commander、fs-extra、glob、inquirer、undici 等
- 系统前端基于 react@18、react-router@6、zustand、antd@5、echarts、react-json-view、nginx、rsbuild 等
- 系统后台主要采用 nestjs 全家桶 以及 typeorm、execa、exceljs、glob、jsonwebtoken，tsup 等
- 数据库方案采用轻量级数据库 splite3
- 项目部署基于 docker，使用 docker-compose 一键部署

## 系统部署和使用

**只需要简单两步即可部署好系统**

### 部署

#### 第一步

准备一台公司内部空闲的服务器，下载`docker`以及`docker-compose`（如已安装可忽略该步骤）

> docker 和 docker-compose 可参考 菜鸟教程 进行安装：

> 1. docker 安装：https://www.runoob.com/docker/ubuntu-docker-install.html
> 2. docker-compose 安装：https://www.runoob.com/docker/docker-compose.html

#### 第二步

在服务器上随便找一个空目录，例如：`/home/app/i18n/` ，进入该目录执行以下安装命令

```bash
## 进入目录
cd /home/app/i18n/

## 使用 bash 执行安装脚本
bash -c "$(curl https://raw.githubusercontent.com/AlbertLin0923/mango-i18n-system/main/install.sh)"
```

根据提示，输入：

1. 系统客户端部署的端口（默认：80）
2. 系统服务端部署的端口（默认：8080）
3. 用于管理员注册的邀请码（也就是注册密钥，建议输入自定义的密钥并保存好密钥）（默认：mango-i18n-system-invitation-code）

接着脚本会远程拉取`docker`镜像并启动安装

脚本执行完毕后，这时候打开服务器对应的项目端口，例如：<http://host:port/user/login> （ host 为该内网服务器 IP 地址，port 为我们刚才设置的客户端的端口） 就可以看到项目已经启动✅

### 配置

此时,进入项目地址, 应该能看到项目已经部署好了

1. 登录 http://host:port/user/login 进行账户的注册或者登录

   > 系统注册默认邀请码（注册密钥）：`mango-i18n-system-invitation-code` ,可用于管理员账户的注册，可在项目部署时候进行更改

2. 登录后 进入 `系统配置-人员配置` `系统配置-界面配置` `系统配置-解析配置` 进行项目配置

### 业务系统接入（可选）

1.  如上文提到，编码过程需要以 `中文` 作为文案，具体使用可参考 `该项目mango-i18n-system/packages/client` 代码
2.  业务项目 下载脚本插件  `pnpm add @mango-scripts/i18n-scripts -D`，
3.  业务项目`package.json`里添加更新指令：

```js
"scripts": {
  "updateLocale": "i18n-scripts updateLocale -f http://xxx/api/locale/get_locale_map -o ./src/locales/common/ -l zh-CN en-US id-ID"
}

其中

-o 参数为 在业务项目里存储语言包的目录地址，例如：./src/locales/common/
-f 参数为 部署的服务器的地址和端口，例如：http://xxx/api/locale/get_locale_map
-l 参数为 需要下载的语言包列表，例如：zh-CN en-US id-ID
```

```
其中
--address     部署的服务器的地址和端口，例如：http://xxx/api/locale/get_locale_map
--output      在业务项目里存储语言包的目录地址，例如：./src/locales/common/
--localeList  需要下载的语言包列表，例如：zh-CN en-US id-ID
```

4. 当需要更新语言包的时候，只需要执行`pnpm run updateLocale`即可

### 更多配置

#### 配置文案模块标识

系统支持文案添加模块标识，便于翻译人员进行筛选，前端开发人员可通过如下注释对业务源代码进行标识：

例如：在目标 `src/views/xxx/index.vue`文件最上面加注释：

```vue
<!-- translateModules:["需求2022009","需求2020102"] -->
```

或者，在 `src/utils/request.ts`文件最上面添加注释：

```js
// translateModules:["需求2022009","需求2020102"]
```

系统会自动读取模块标识，该文件下的所有提取到的中文 key 文案，都将带有属性 `modules:'需求2022009,需求2020102'`，方便在系统前端上进行区分和筛选

#### 配置无需提取的文案

系统会`默认不提取业务代码的注释的中文`。但有些时候，我们一些**未被注释**的特殊的中文文案 key 也不想被自动文案配置系统提取，这时候，我们可以在 `AST 解析模式`下，使用类似`eslint-disable`的注释效果，以注释不需要提取的中文文案 key

```js

// 这种注释引擎会忽略整个文件中文文案key的提取，优先级最高
// translate-disable-entire-file

const getFilterStatusMap = (statusMap, type) => {
  if (type === 'pendingCase') {
    return statusMap.filter((i) => {
      return (
        // 这种注释引擎会忽略提取中间包裹的代码段中的中文文案key
        // translate-disable
        i.text === '待处理' ||
        i.text === '处理中'
        // translate-disable
      )
    })
  } else if (type === 'allCase') {
    return statusMap.filter((i) => {
      return (
        // 下面注释引擎会忽略提取 下一行 代码的中文文案key
        // translate-disable-next-line
        i.text === '已处理'
      )
    })
  } else if (type === 'myCase') {
    return statusMap.filter((i) => {
      return (
        // 下面注释引擎会忽略提取 当前行 代码的中文文案key
        i.text === '无需处理' || // translate-disable-line
      )
    })
  }  else {
    return statusMap
  }
}
```

## 项目二次开发

### 本地启动与开发调试

1. clone 系统代码到本地
2. cd 到 项目根目录，执行 pnpm i，安装依赖包
3. cd 到 packages/server ，执行pnpm dev ，启动服务端
4. cd 到 packages/client，执行pnpm dev，启动客户端
5. 根据命令行的提示，这时候打开 http://localhost 即可看到项目已经启动了😄

### 使用源码进行本地部署

项目二次开发后，可托管到自己的代码仓库，然后在服务器上通过源码部署：

1. 准备一台公司内部空闲的服务器，下载 `docker` 以及 `docker-compose`
2. 在服务器上找一个空目录，例如：`/home/app/i18n/` ，进入该目录，克隆该项目源码到目录里面
3. 执行 `docker-compose up -d` 进行一键部署
4. 其他配置同上

## 源码

项目源码地址

- [mango-i18n-system](https://github.com/AlbertLin0923/mango-i18n-system)

## TODO List

- 文案解析器支持更多格式的文件

## 参考资料

[Kiwi-国际化全流程解决方案](https://github.com/alibaba/kiwi)

[聊聊前端国际化文案该如何处理](https://juejin.cn/post/6844903778471280653)

[如何快速解决繁杂的国际化替换](https://juejin.im/post/6844903680777388039)

[字节前端如何基于 AST 做国际化重构？](https://toutiao.io/posts/vcb200u/preview)

[astexplorer](https://astexplorer.net/)
