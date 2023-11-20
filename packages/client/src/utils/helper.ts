import { v4 as uuid } from 'uuid'

import { multiply, add } from './math'

export const getRandomKey = (length = 16): string => {
  return (
    Math.random().toString(36).substring(3, length) +
    Date.now().toString(36).substring(3, length)
  )
}

export const getCustomUuid = (): string => {
  return uuid().replace(/-/g, '')
}

export const getPlatform = () => {
  const ua = navigator.userAgent
  const isWindowsPhone = /(?:Windows Phone)/.test(ua)
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  const isAndroid = /(?:Android)/.test(ua)
  const isFireFox = /(?:Firefox)/.test(ua)
  const isTablet =
    /(?:iPad|PlayBook)/.test(ua) ||
    (isAndroid && !/(?:Mobile)/.test(ua)) ||
    (isFireFox && /(?:Tablet)/.test(ua))
  const isIPhone = /(?:iPhone)/.test(ua) && !isTablet
  const isPc = !isIPhone && !isAndroid && !isSymbian
  const isWechat = ua.toLowerCase().indexOf('micromessenger') !== -1
  const isDingTalk = ua.toLowerCase().indexOf('dingtalk') !== -1

  return {
    isTablet,
    isIPhone,
    isAndroid,
    isPc,
    isWechat,
    isDingTalk,
  }
}

export const updateArrayItem = <T extends Record<string, any>>(
  arr: T[],
  match: any,
  property: any,
  setType: 'insert' | 'replace' = 'insert',
  matchKey: string = 'id',
) => {
  return arr.map((i) =>
    i[matchKey] === match
      ? setType === 'insert'
        ? { ...i, ...property }
        : { ...property }
      : i,
  ) as T[]
}

export const priceCalc = (arr: any[], unitPrice: string, quantity?: string) => {
  return arr?.length > 0
    ? arr?.reduce((prev, curr) => {
        return add(
          multiply(curr?.[unitPrice] ?? 0, quantity ? curr?.[quantity] : 1),
          prev,
        )
      }, 0)
    : 0
}

export const findStub = (str: string) => {
  return str.match(/{{*[^{}]*}}*/g) || null
}

export const isObject = (val: any) =>
  Object.prototype.toString.call(val) === '[object Object]'
