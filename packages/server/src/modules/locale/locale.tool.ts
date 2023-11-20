import path from 'path'

import fs from 'fs-extra'
import { execa } from 'execa'
import { glob } from 'glob'
import getFolderSize from 'get-folder-size'

import { ExecTimer, logger } from '../../common/utils/index.js'
import { Extractor } from '../../common/type/index.js'

import { extractChineseFieldList, formatLocaleObj } from './locale.utils.js'

export type LocaleItem = {
  'zh-CN': string
  modules: string
}

export interface ExecResult {
  success: boolean
  message: string[]
  readResult: any[]
}

const sourceCodePath = path.resolve(process.cwd(), './sourceCode')
const sourceCodeContentHashMapPath = path.resolve(
  process.cwd(),
  './contentHash/source-code-content-hash-map.json',
)

const testPath = (jsonPathList: string[], alias: string[]): string[] => {
  const pathList = alias.map((i) => {
    return `${i}.json`
  })
  return jsonPathList.filter((i) => {
    const r = pathList.some((p) => i.includes(p))
    return r
  })
}

const convertStringToJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.log(error)
    return {}
  }
}

const actionResource = async (
  gitRepositoryUrl: string,
  gitAccessUserName: string,
  gitAccessToken: string,
  projectDirName: string,
  resolveGitBranchName: string,
): Promise<ExecResult> => {
  const execResult: ExecResult = {
    success: true,
    message: [],
    readResult: [],
  }

  const projectPath = path.resolve(`${sourceCodePath}/${projectDirName}`)
  const isHttpsHeaderGitRepositoryUrl = gitRepositoryUrl.startsWith(`https:`)
  const subGitRepositoryUrl = gitRepositoryUrl.match(
    /(?<=(https|http):\/\/)(.*)/g,
  )[0]

  const collectLogger = (action: string, result: string) => {
    const str = logger(action, result)
    execResult.message.push(str)
  }

  try {
    if (!fs.existsSync(sourceCodePath)) {
      await fs.ensureDir(sourceCodePath)
      collectLogger('创建仓库存储目录', `创建目录成功，路径：${sourceCodePath}`)
    } else {
      collectLogger('创建仓库存储目录', `目录已存在，路径：${sourceCodePath}`)
    }

    if (!fs.existsSync(projectPath)) {
      const storeGitAccessTokenResult = await execa(
        'git config --global credential.helper store',
        {
          shell: true,
          cwd: sourceCodePath,
        },
      )

      collectLogger(
        '设置git credential helper store',
        `设置成功： ${storeGitAccessTokenResult.stdout}`,
      )

      const cloneResult = await execa(
        `git clone ${
          isHttpsHeaderGitRepositoryUrl ? 'https' : 'http'
        }://${gitAccessUserName}:${gitAccessToken}@${subGitRepositoryUrl}`,
        {
          shell: true,
          cwd: sourceCodePath,
        },
      )

      collectLogger('克隆仓库', `克隆仓库成功：${cloneResult.stdout}`)
    } else {
      collectLogger('克隆仓库', `仓库已存在，路径：${projectPath}`)
    }

    const checkoutResult = await execa(`git checkout ${resolveGitBranchName}`, {
      shell: true,
      cwd: projectPath,
    })

    collectLogger('切换到目标分支', `切换成功：${checkoutResult.stdout}`)

    const pullResult = await execa(`git pull origin ${resolveGitBranchName}`, {
      shell: true,
      cwd: projectPath,
    })

    collectLogger('更新目标分支', `更新成功：${pullResult.stdout}`)
  } catch (error) {
    execResult.success = false
    collectLogger('克隆和更新仓库', `失败：${error.stderr}`)
  }

  return execResult
}

// --------------------------------

export const reActionResource = async (
  gitRepositoryUrl: string,
  gitAccessUserName: string,
  gitAccessToken: string,
  projectDirName: string,
  resolveGitBranchName: string,
) => {
  const execResult: ExecResult = {
    success: true,
    message: [],
    readResult: [],
  }

  const projectPath = path.resolve(`${sourceCodePath}/${projectDirName}`)
  const isHttpsHeaderGitRepositoryUrl = gitRepositoryUrl.startsWith(`https:`)
  const subGitRepositoryUrl = gitRepositoryUrl.match(
    /(?<=(https|http):\/\/)(.*)/g,
  )[0]

  const collectLogger = (action: string, result: string) => {
    const str = logger(action, result)
    execResult.message.push(str)
  }

  try {
    if (!fs.existsSync(sourceCodePath)) {
      await fs.ensureDir(sourceCodePath)
      collectLogger('创建仓库存储目录', `创建目录成功，路径：${sourceCodePath}`)
    } else {
      collectLogger('创建仓库存储目录', `目录已存在，路径：${sourceCodePath}`)
    }

    if (fs.existsSync(projectPath)) {
      await fs.remove(projectPath)
      collectLogger('删除目标仓库', `删除成功：${projectPath}`)
    } else {
      collectLogger('删除目标仓库', `仓库不存在，无需删除`)
    }

    const storeGitAccessTokenResult = await execa(
      'git config --global credential.helper store',
      {
        shell: true,
        cwd: sourceCodePath,
      },
    )
    collectLogger(
      '设置git credential helper store',
      `设置成功：${storeGitAccessTokenResult.stdout}`,
    )

    const cloneResult = await execa(
      `git clone ${
        isHttpsHeaderGitRepositoryUrl ? 'https' : 'http'
      }://${gitAccessUserName}:${gitAccessToken}@${subGitRepositoryUrl}`,
      {
        shell: true,
        cwd: sourceCodePath,
      },
    )
    collectLogger('克隆仓库', `克隆仓库成功：${cloneResult.stdout}`)

    const checkoutResult = await execa(`git checkout ${resolveGitBranchName}`, {
      shell: true,
      cwd: projectPath,
    })
    collectLogger('切换到目标分支', `切换成功：${checkoutResult.stdout}`)

    const pullResult = await execa(`git pull origin ${resolveGitBranchName}`, {
      // shell: true,
      cwd: projectPath,
    })
    collectLogger('更新目标分支', `更新成功：${pullResult.stdout}`)
  } catch (error) {
    execResult.success = false
    collectLogger('克隆和更新仓库', `失败：${error.stderr}`)
  }

  return execResult
}

const extractChineseFieldListFromSourceCode = async (
  gitRepositoryUrl: string,
  gitAccessUserName: string,
  gitAccessToken: string,
  projectDirName: string,
  resolveGitBranchName: string,
  resolveDirPathList: string[],
  filterExtNameList: string[],
  extractor: Extractor,
): Promise<ExecResult> => {
  const execResult: ExecResult = await actionResource(
    gitRepositoryUrl,
    gitAccessUserName,
    gitAccessToken,
    projectDirName,
    resolveGitBranchName,
  )

  if (!execResult.success) {
    return execResult
  }

  const collectLogger = (action: string, result: string) => {
    const str = logger(action, result)
    execResult.message.push(str)
  }

  try {
    let readResult: LocaleItem[] = []
    let readResultMessage = ''

    const execTimer = new ExecTimer()
    if (extractor === Extractor.REGEX) {
      execTimer.start('regex')
      readResult = await extractChineseFieldList(
        Extractor.REGEX,
        resolveDirPathList,
        filterExtNameList,
        sourceCodeContentHashMapPath,
      )
      execTimer.end('regex')
      readResultMessage = `使用regex读取仓库中文key成功，共读取到${
        readResult.length
      }条，耗时${execTimer.duration('regex') / 1000}s`
    } else {
      execTimer.start('ast')
      readResult = await extractChineseFieldList(
        Extractor.AST,
        resolveDirPathList,
        filterExtNameList,
        sourceCodeContentHashMapPath,
      )
      execTimer.end('ast')
      readResultMessage = `使用ast读取仓库中文key成功，共读取到${
        readResult.length
      }条，耗时${execTimer.duration('ast') / 1000}s`
    }

    collectLogger('读取仓库中文key', `读取成功：${readResultMessage}`)
    execResult.readResult = readResult
  } catch (error) {
    execResult.success = false
    collectLogger('读取仓库中文key', `读取失败：${error}`)
  }

  return execResult
}

const extractLocaleFromSourceCode = async (
  gitRepositoryUrl: string,
  gitAccessUserName: string,
  gitAccessToken: string,
  projectDirName: string,
  resolveGitBranchName: string,
  localeDict: string[],
): Promise<ExecResult> => {
  const projectPath = path.resolve(`${sourceCodePath}/${projectDirName}`)

  const execResult: ExecResult = await actionResource(
    gitRepositoryUrl,
    gitAccessUserName,
    gitAccessToken,
    projectDirName,
    resolveGitBranchName,
  )

  if (!execResult.success) {
    return execResult
  }

  const collectLogger = (action: string, result: string) => {
    const str = logger(action, result)
    execResult.message.push(str)
  }

  try {
    const readResult = []

    // 读取所有json文件
    const jsonPathList = await glob(`${projectPath}/**/*.json`)

    // 筛选出符合语言包格式的json文件map
    const localePathMap = localeDict.map((item) => {
      const localePathItem = testPath(jsonPathList, [item])
      return { fileName: item, localePathItem }
    })

    localePathMap.forEach((i) => {
      const { fileName, localePathItem } = i
      const localeObj = {}
      localePathItem.length > 0 &&
        localePathItem.forEach((k) => {
          const res: Buffer = fs.readFileSync(k)
          const json = convertStringToJSON(res.toString())
          Object.assign(localeObj, json)
        })
      readResult.push({ fileName, locale: formatLocaleObj(localeObj) })
    })

    collectLogger('读取仓库语言包', `读取成功：读取仓库语言包成功`)
    execResult.readResult = readResult
  } catch (error) {
    execResult.success = false
    collectLogger('读取仓库语言包', `读取失败：${error}`)
  }

  return execResult
}

const extractAllDirPathFromSourceCode = async (
  gitRepositoryUrl: string,
  gitAccessUserName: string,
  gitAccessToken: string,
  projectDirName: string,
  resolveGitBranchName: string,
): Promise<ExecResult> => {
  const projectPath = path.resolve(`${sourceCodePath}/${projectDirName}`)

  const execResult: ExecResult = await actionResource(
    gitRepositoryUrl,
    gitAccessUserName,
    gitAccessToken,
    projectDirName,
    resolveGitBranchName,
  )

  console.log('execResult', execResult)

  if (!execResult.success) {
    return execResult
  }

  try {
    const size = await getFolderSize.loose(`${projectPath}`)
    console.log('size', size)
    execResult.message.push(
      logger(
        '获取仓库大小',
        `获取成功，仓库占用${(size / 1024 / 1024).toFixed(2)} MB`,
      ),
    )

    const logResult = await execa('git log -1', {
      shell: true,
      cwd: projectPath,
    })

    execResult.message.push(
      logger('获取仓库最近一次提交记录', `获取成功，\n ${logResult.stdout}`),
    )

    const readResult = await glob(`${projectPath}/**/`)
    execResult.message.push(
      logger(
        '获取仓库目录列表',
        `获取成功，共获取到${readResult.length}个目录`,
      ),
    )
    execResult.readResult = readResult
  } catch (error) {
    console.log('error', error)
    execResult.success = false
    execResult.message.push(error)
  }

  return execResult
}

export {
  extractChineseFieldListFromSourceCode,
  extractLocaleFromSourceCode,
  extractAllDirPathFromSourceCode,
}
