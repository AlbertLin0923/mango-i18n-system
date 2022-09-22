## 图标使用

图标导入使用有两种方式:

1.使用 `Antd` 的 `Icon`组件

具体使用方式见 antd 文档 [https://ant.design/components/icon-cn/](https://ant.design/components/icon-cn/)

2.使用自定义组件 SvgIcon

**使用方法**: 第一步：在 iconfont 或者其他图标库挑选中意的图标，下载 SVG 格式的文件到本地

第二步：将 svg 文件放到项目 src/icons/svg 文件夹下

第三步：在组件或者页面 引入并使用

```
import SvgIcon from '@/components/SvgIcon' // svg component

<SvgIcon className="xxx" style={{'color':'red'}} iconClass="password"></SvgIcon> // iconClass 为 icon 文件的名字
```

tips:

- svgIcon 默认会读取其父级的 color fill: currentColor;你可以改变父级的 color 或者直接改变 fill 的颜色即可。
- svgIcon 可以通过 style 或者 className 设置其样式

> 参考资料: https://panjiachen.github.io/vue-element-admin-site/zh/
