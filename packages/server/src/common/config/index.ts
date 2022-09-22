import * as fs from 'fs-extra';
import * as path from 'path';
import { isFunction } from '../utils';

const PROJECT_CONFIG_FILE_NAME_LIST = [
  'system.config.js',
  '.systemrc.js',
];

/**
 * @description: 递归获取配置文件
 * @param {string} dir
 * @param {string} fileName
 * @return {*} 目标文件
 */
const lookForFile = (dir: string, fileNameList: string[]): string => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const currName = path.join(dir, file);
    const info = fs.statSync(currName);
    if (info.isDirectory()) {
      if (file === '.git' || file === 'node_modules') {
        continue;
      }
      const result = lookForFile(currName, fileNameList);
      if (result) {
        return result;
      }
    } else if (info.isFile() && fileNameList.includes(file)) {
      return currName;
    }
  }
};

/**
 * @description: 获得项目配置信息
 * @param {*}
 * @return {*}
 */
const getProjectConfig = (): any => {
  const rootDir = path.resolve(process.cwd(), `./`);
  const configFilePath = lookForFile(rootDir, PROJECT_CONFIG_FILE_NAME_LIST);
  let obj = {};

  if (configFilePath && fs.existsSync(configFilePath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(configFilePath);
    const configAsObject = isFunction(config) ? config() : config;
    obj = {
      ...obj,
      ...configAsObject,
    };
  } else {
    throw new Error(
      'system: Config file not found. check if file exists at root (system.config.js, .systemrc.js)',
    );
  }

  return obj;
};

const CONFIG = getProjectConfig();

CONFIG.get = (key: string) => {
  if (!CONFIG.hasOwnProperty(key)) {
    throw new Error(`配置文件出错,缺少${key}}`);
  }
  return CONFIG[key];
};

export default CONFIG;
