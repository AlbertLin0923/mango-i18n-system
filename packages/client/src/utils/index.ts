import dayjs, { Dayjs } from 'dayjs'
import moment, { Moment } from 'moment'

/**
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function parseDateString(
  timestamp: Dayjs | Moment | Date | null | string | number,
  format = 'YYYY-MM-DD HH:mm:ss'
): string {
  if (!timestamp) {
    return ''
  }

  if (moment.isMoment(timestamp)) return moment(timestamp).format(format)

  return dayjs(timestamp).format(format)
}

export const findLabel = (dict: Array<any>, id: any, label = 'label', value = 'value') => {
  const item = dict.find((i: any) => i[value] === id)
  return item ? item[label] : null
}

export const findStub = (str: string) => {
  return str.match(/{{*[^{}]*}}*/g) || null
}

export const randomKey = (length = 16) => {
  return (
    Math.random().toString(36).substring(3, length) + Date.now().toString(36).substring(3, length)
  )
}

export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const fileToBlob = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export const getImageRect = (base64OrUrl: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = base64OrUrl
    image.onload = () => resolve({ width: image.width, height: image.height, image: image })
    image.onerror = (error) => reject(error)
  })
}

export const getFileExtendName = (filename: string) => {
  // 文件扩展名匹配正则
  const reg = /\.([^.]+$)/
  const matches = filename.match(reg)
  if (matches) {
    return matches[1]
  }
  return ''
}

export const getFileNameFromFileLink = (str: string) => {
  if (!str) {
    return ''
  }
  const link = str.split('?')[0]
  const nameArr = link.split('/')
  return nameArr[nameArr.length - 1]
}
