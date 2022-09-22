# mango-i18n-system 国际化文案配置系统



## 运行流程

1. 用户打开 国际化文案配置系统 前端页面 
2. 每次前端页面刷新，页面会调用更新源代码接口
3. 对应地，服务器server执行更新源代码，读取文案词条
4. 获取最新的中文keys,同步到数据库
5. 并且回传到前端client


##  如何部署一个新项目

以新起`vue-element-admin 国际化文案配置系统`为例

### 1.适配代码

- 切换新分支 `feature/vue-element-admin`, 建议以 `feature/接入业务系统的Gitlab名字`作为分支名称

- 执行 文件 `zx scripts/adapt.mjs` ,该文件会修改项目一些配置文件，适配项目

- 提交代码 `git add .` ,`git commit -m"feat: 适配vue-element-admin项目"` `git push`

- 适配代码完成

### 2.部署项目

- 进入服务器 `fe/`下, clone 项目, 并重命名文件夹为 `vue-element-admin` `mv mango-i18n-system vue-element-admin`

- 进入项目,切换到目标分支`feature/vue-element-admin`

- 执行`docker-compose up -d` 进行docker部署

- 部署项目结束

### 3.配置项目

- 此时,进入项目地址, 应该能看到项目已经部署好了
- 注册账号
- 登录后 进入 `系统配置-界面配置` `系统配置-解析配置` 进行项目配置

- 配置项目完成


##  业务项目接入

### 下载

下载脚本包 `pnpm i @mango-scripts/i18n-scripts`

### 使用

package.json

```
  "scripts": {
    "updateLocale": "i18n-scripts updateLocale -f http://xxx/api/locale/get_locale_map -o ./src/locales/common/ -l zh-CN en-US id-ID"
  }
```




## 关于模块化

翻译系统支持字段分模块，例如:在目标`src/views/troubleshoot/logComplaint/detail.vue`文件最上面加注释

```
// translateModules:["排查系统1","审核系统2"]
```

系统会自动读取到平台上，该文件下的所有提取到的中文key，都将带有属性modules:'排查系统1,审核系统2'


## 关于配置禁用注释

ast 解析模式下，支持类似eslint-disable 的注释效果，以注释不需要提取的中文key

```
// 这种注释引擎会忽略整个文件中文key的提取，优先级最高
// translate-disable-entire-file

const getFilterStatusMap = (statusMap, type) => {
  if (type === 'pendingCase') {
    return statusMap.filter((i) => {
      return (
        // 这种注释引擎会忽略提取中间包裹的代码段中的中文key
        // translate-disable
        i.text === '易烊千玺' ||
        i.text === '张杰'
        // translate-disable
      )
    })
  } else if (type === 'allCase') {
    return statusMap.filter((i) => {
      return (
        // 下面注释引擎会忽略提取 下一行 代码的中文key
        // translate-disable-next-line
        i.text === '周杰伦' ||
        i.text === '林俊杰' ||
        i.text === '王力宏'
      )
    })
  } else if (type === 'myCase') {
    return statusMap.filter((i) => {
      return (
        // 下面注释引擎会忽略提取 当前行 代码的中文key
        i.text === '林更新' || // translate-disable-line
        i.text === '刘德华'
      )
    })
  }  else {
    return statusMap
  }
}
```



