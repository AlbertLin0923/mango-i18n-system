// 定义各种全局 TypesSript 模块 / 命名空间 / 类型 / 接口 等

declare module 'slash2'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module 'omit.js'
declare module 'numeral'
declare module '@antv/data-set'
declare module 'mockjs'
declare module 'react-fittext'
declare module 'bizcharts-plugin-slider'

declare type BROWSER_SUPPORT_DETECTER = {
  AVIF: boolean
  WEBP: boolean
}

declare interface Window {
  BROWSER_SUPPORT_DETECTER: BROWSER_SUPPORT_DETECTER
}

declare type TablePaginationType = {
  pageNum: number
  pageSize: number
}

declare type ReturnResponse<T> = Promise<{
  code: number
  data: T
  msg: string
}>
