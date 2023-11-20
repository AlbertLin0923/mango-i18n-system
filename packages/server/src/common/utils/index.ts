import crypto from 'crypto'

import dayjs from 'dayjs'
import pico from 'picocolors'

import { ObjectLiteral } from '../type/index.js'

export const isFunction = (value: any): boolean => {
  return typeof value === 'function'
}

export const isArray = (value: any): boolean => {
  return Array.isArray(value)
}

export const isString = (value: any): boolean => {
  return typeof value === 'string'
}

export const isBoolean = (value: any): boolean => {
  return typeof value === 'boolean'
}

/**
 * @description: 过滤对象属性
 * @param {Record<string, unknown>} object 待过滤的对象
 * @param {string[]} filterPropertyList 待过滤的属性名列表
 * @return {Record<string, unknown>}  已过滤的对象
 */
export const filterObjProperties = (
  object: ObjectLiteral,
  filterPropertyList: string[],
): ObjectLiteral => {
  const r = {}
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (!filterPropertyList.includes(key)) {
        r[key] = object[key]
      }
    }
  }
  return r
}

export const hashPassword = (password: string, passwordSalt: string) => {
  return crypto
    .createHmac('sha256', passwordSalt)
    .update(password)
    .digest('hex')
}

export function parseDateString(
  timestamp: Date | null | string | number,
  format = 'YYYY-MM-DD HH:mm:ss:SSS',
): string {
  if (!timestamp) {
    return ''
  }
  return dayjs(timestamp).format(format)
}

export const createQueryParams = (
  queryObject: Record<string, any>,
  namespace: string,
  timeDurationKey: string,
) => {
  let queryStr = ''
  let queryObj = {}

  const queryObjectKeyList = Object.keys(queryObject).filter((key) => {
    return (
      queryObject[key] !== undefined &&
      queryObject[key] !== null &&
      queryObject[key] !== '' &&
      key !== timeDurationKey
    )
  })

  queryObjectKeyList.length > 0 &&
    queryObjectKeyList.forEach((key, index) => {
      if (index === 0) {
        queryStr += `${namespace}.${key} = :${key}`
      } else {
        queryStr += ` and ${namespace}.${key} = :${key}`
      }

      queryObj[key] = queryObject[key]
    })

  if (queryObject[timeDurationKey]) {
    queryStr = queryStr
      ? `${queryStr} and ${timeDurationKey} BETWEEN :start AND :end`
      : `${timeDurationKey} BETWEEN :start AND :end`

    queryObj = {
      ...queryObj,
      ...{
        start: queryObject[timeDurationKey][0],
        end: queryObject[timeDurationKey][1],
      },
    }
  }

  return [queryStr, queryObj]
}

export class ExecTimer {
  record: ObjectLiteral
  constructor() {
    this.record = {}
  }

  public start(tag: string) {
    const start = Date.now()
    if (!this.record[tag]) {
      this.record[tag] = {}
    }
    this.record[tag]['start'] = start
    return start
  }

  public end(tag: string) {
    const end = Date.now()
    if (!this.record[tag]) {
      this.record[tag] = {}
    }
    this.record[tag]['end'] = end
    return Date.now()
  }

  public duration(tag: string) {
    if (!this.record[tag]) {
      this.record[tag] = {}
    }
    return this.record[tag]['end'] - this.record[tag]['start']
  }
}

export const logger = (action: string, result: string) => {
  const t = parseDateString(new Date(), 'YYYY-MM-DD HH:mm:ss')
  console.log(`[${pico.green(t)}] ${pico.cyan(`[${action}]`)} ${result}`)
  return `[${t}] ${`[${action}]`} ${result}`
}
