// 与 文件api 相关的处理工具函数
import { getFileExtName } from '@mango-kit/utils'

export const transformImageUrl = (src: string | undefined) => {
  if (!src) return src
  const fileType = getFileExtName(src)
  if (window?.['BROWSER_SUPPORT_DETECTER']?.['AVIF'] && fileType !== 'avif') {
    return src + '?x-oss-process=image/format,avif'
  } else if (
    window?.['BROWSER_SUPPORT_DETECTER']?.['WEBP'] &&
    fileType !== 'webp'
  ) {
    return src + '?x-oss-process=image/format,webp'
  } else {
    return src
  }
}
