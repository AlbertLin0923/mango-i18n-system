import {
  extractChineseFieldList,
  formatLocaleStr,
  formatLocaleObj,
} from '@mango-scripts/i18n-utils';

export { extractChineseFieldList, formatLocaleStr, formatLocaleObj };

export const objToArr = (obj: Record<string, any>) => {
  return Object.entries(obj).map(([key, value]) => {
    return {
      key,
      value,
    };
  });
};

/**
 * @description: 判断excel单元格的值是否合法
 * @param {*} v 单元格的值
 * @return {*} 是否合法
 */
export const isLegalExcelCellValue = (v) => {
  // undefined,null,"",0,false 不允许
  if (!v) {
    return false;
  }
  // 字符串需要进一步去除制表符
  if (formatLocaleStr(v)) {
    return true;
  } else {
    return false;
  }
};

export const transformListToMap = (
  list: Array<any>,
  localeDict: Array<string>,
) => {
  const map: Record<string, any> = {};

  localeDict.forEach((i) => {
    map[i] = {};
  });

  list
    .sort((a, b) => a['zh-CN'].localeCompare(b['zh-CN']))
    .forEach((langItem) => {
      const k = langItem['zh-CN'];
      localeDict.forEach((key) => {
        langItem[key] ? (map[key][k] = langItem[key]) : null;
      });
    });

  return map;
};

export const compareLocaleData = (
  oldObj: Record<string, any>,
  newObj: Record<string, any>,
) => {
  const oldArr = objToArr(oldObj);
  const newArr = objToArr(newObj);

  let sameNumber = 0;
  let addNumber = 0;
  let modifyNumber = 0;
  const deleteNumber = 0;

  for (let index = 0; index < newArr.length; index++) {
    const newItem = newArr[index];
    const findSameKeyItem = oldArr.find((oldItem) => {
      return newItem.key === oldItem.key;
    });
    if (!findSameKeyItem) {
      addNumber++;
    } else {
      if (findSameKeyItem.value === newItem.value) {
        sameNumber++;
      } else {
        modifyNumber++;
      }
    }
  }

  return {
    sameNumber,
    addNumber,
    modifyNumber,
    deleteNumber,
  };
};

export const formatExcelData = (excelList, localeDict) => {
  const result = [];
  excelList.forEach((arrayItem) => {
    if (
      arrayItem &&
      Array.isArray(arrayItem) &&
      arrayItem.length > 0 &&
      isLegalExcelCellValue(arrayItem[0])
    ) {
      const arrayItemResult = [];
      for (let index = 0; index < arrayItem.length; index++) {
        if (isLegalExcelCellValue(arrayItem[index])) {
          arrayItemResult.push(formatLocaleStr(arrayItem[index]));
        } else {
          arrayItemResult.push('');
        }
      }
      result.push(arrayItemResult);
    }
  });

  const formatlist = result.map((val) => {
    const r = {};
    localeDict.forEach((item, index) => {
      if (isLegalExcelCellValue(val[index])) {
        r[item] = val[index];
      }
    });
    return r;
  });

  return formatlist;
};

export const getCompareLocaleStat = (oldList, newList, localeDict) => {
  const oldMap = transformListToMap(oldList, localeDict);
  const newMap = transformListToMap(newList, localeDict);
  const stat = {};

  localeDict.forEach((locale) => {
    stat[locale] = compareLocaleData(
      oldMap[locale] ?? {},
      newMap[locale] ?? {},
    );
  });

  return stat;
};

export const getFileExtendName = (filename: string) => {
  const reg = /\.([^.]+$)/;
  const matches = filename.match(reg);
  if (matches) {
    return matches[1];
  }
  return '';
};

export const getFileNameWithoutExtendName = (filename: string) => {
  const reg = /(.*)(?=\.[^.]*)/g;
  const matches = filename.match(reg);
  if (matches) {
    return matches[0];
  }
  return '';
};

export const transformListToObj = (list: Array<any>, localeDict) => {
  const map: Record<string, any> = {};
  list.forEach((langItem) => {
    const k = langItem['zh-CN'];
    const v = {};
    localeDict.forEach((key) => {
      v[key] = isLegalExcelCellValue(langItem[key]) ? langItem[key] : '';
    });
    map[k] = v;
  });

  return map;
};

export const completeLocaleItem = (
  item: Record<string, any>,
  localeDict: Array<string>,
) => {
  const i = {};
  localeDict.forEach((key) => {
    i[key] = isLegalExcelCellValue(item[key]) ? item[key] : '';
  });

  return i;
};

export const completeLocaleList = (
  list: Array<any>,
  localeDict: Array<string>,
) => {
  return list.map((item) => {
    const i = {};
    localeDict.forEach((key) => {
      i[key] = isLegalExcelCellValue(item[key]) ? item[key] : '';
    });

    return i;
  });
};

export const filterLocaleItem = (
  item: Record<string, any>,
  localeDict: Array<string>,
) => {
  const i = {};
  localeDict.forEach((key) => {
    isLegalExcelCellValue(item[key]) ? (i[key] = item[key]) : '';
  });

  return i;
};

export const findStub = (str: string) => {
  return str.match(/{{*[^{}]*}}*/g) || null;
};

export const findStubInLocaleList = (
  list: Array<any>,
  localeDict: Array<string>,
) => {
  const result: Array<any> = [];

  const filterFunc = (item: Record<string, any>) => {
    const stub = findStub(item['zh-CN']);
    if (stub) {
      const errorLocale = localeDict.filter((key) =>
        stub.some((it) => item[key] && !item[key].includes(it)),
      );

      if (errorLocale.length > 0) {
        result.push({
          key: item['zh-CN'],
          error_locale: errorLocale.map((d) => ({
            key: d,
            value: item[d],
          })),
        });
      }
    }
  };

  list.forEach((i) => {
    filterFunc(i);
  });

  return result;
};
