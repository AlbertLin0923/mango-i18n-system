import path from 'node:path'
import util from 'node:util'

import log4js from 'log4js'
import stackTrace from 'stacktrace-js'
import pico from 'picocolors'

import { parseDateString } from '../utils/index.js'

const baseLogPath = path.resolve(process.cwd(), './logs')
const log4jsConfig = {
  appenders: {
    console: {
      type: 'console',
    },
    access: {
      type: 'dateFile', // 会写入文件，并按照日期分类
      filename: `${baseLogPath}/access/access.log`, // 日志文件名，会命名为：access.20200320.log
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
      daysToKeep: 15,
      numBackups: 3,
      category: 'http',
      keepFileExt: true, // 是否保留文件后缀
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 15,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern:
          '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 15,
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'app', 'errors'],
      level: 'DEBUG',
    },
    info: { appenders: ['console', 'app', 'errors'], level: 'info' },
    access: { appenders: ['console', 'app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
  },
  pm2: true, // 使用 pm2 来管理项目时，打开
  pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
}

// 日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

// 内容跟踪类
class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number,
  ) {}
}

log4js.addLayout('Awesome-nest', (logConfig: any) => {
  return (logEvent: log4js.LoggingEvent): string => {
    let moduleName = ''
    let position = ''

    // 日志组装
    const messageList: string[] = []
    logEvent.data.forEach((value: any) => {
      if (value instanceof ContextTrace) {
        moduleName = value.context
        // 显示触发日志的坐标（行，列）
        if (value.lineNumber && value.columnNumber) {
          position = `${value.lineNumber}, ${value.columnNumber}`
        }
        return
      }

      if (typeof value !== 'string') {
        value = util.inspect(value, false, 3, true)
      }

      messageList.push(value)
    })

    // 日志组成部分
    const messageOutput: string = messageList.join(' ')
    const positionOutput: string = position ? ` [${position}]` : ''
    const typeOutput = `[${logConfig.type}] ${logEvent.pid.toString()}   - `
    const dateOutput = `${parseDateString(logEvent.startTime)}`
    const moduleOutput: string = moduleName
      ? `[${moduleName}] `
      : '[LoggerService] '
    let levelOutput = `[${logEvent.level}] ${messageOutput}`

    // 根据日志级别，用不同颜色区分
    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        levelOutput = pico.green(levelOutput)
        break
      case LoggerLevel.INFO:
        levelOutput = pico.cyan(levelOutput)
        break
      case LoggerLevel.WARN:
        levelOutput = pico.yellow(levelOutput)
        break
      case LoggerLevel.ERROR:
        levelOutput = pico.red(levelOutput)
        break
      case LoggerLevel.FATAL:
        levelOutput = pico.magenta(levelOutput)
        break
      default:
        levelOutput = pico.gray(levelOutput)
        break
    }

    return `${pico.green(typeOutput)}${dateOutput}  ${pico.yellow(
      moduleOutput,
    )}${levelOutput}${positionOutput}`
  }
})

// 注入配置
log4js.configure(log4jsConfig)

// 实例化
const logger = log4js.getLogger()
logger.level = LoggerLevel.TRACE

export class Logger {
  static trace(...args) {
    logger.trace(Logger.getStackTrace(), ...args)
  }

  static debug(...args) {
    logger.debug(Logger.getStackTrace(), ...args)
  }

  static log(...args) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static info(...args) {
    logger.info(Logger.getStackTrace(), ...args)
  }

  static warn(...args) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static warning(...args) {
    logger.warn(Logger.getStackTrace(), ...args)
  }

  static error(...args) {
    logger.error(Logger.getStackTrace(), ...args)
  }

  static fatal(...args) {
    logger.fatal(Logger.getStackTrace(), ...args)
  }

  static access(...args) {
    const loggerCustom = log4js.getLogger('http')
    loggerCustom.info(Logger.getStackTrace(), ...args)
  }

  // 日志追踪，可以追溯到哪个文件、第几行第几列
  static getStackTrace(deep = 2): string {
    const stackList: stackTrace.StackFrame[] = stackTrace.getSync()
    const stackInfo: stackTrace.StackFrame = stackList[deep]

    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    const fileName: string = stackInfo.fileName
    const basename: string = path.basename(fileName)
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`
  }
}
