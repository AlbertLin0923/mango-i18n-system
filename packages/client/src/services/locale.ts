import request from '@/utils/request'

export type AddLocaleParamsType = {
  'zh-CN': string
  [key: string]: string
  modules: string
}

export type UpdateLocaleParamsType = {
  'zh-CN': string
  [key: string]: string
  modules: string
}

export type Locale = {
  create_time: number
  update_time: number
  version: number
  modules: string
  [key: string]: any
}

export async function getDict() {
  return request('/locale/get_dict', {
    method: 'get',
  })
}

export async function getLocaleList(): ReturnResponse<{
  list: Locale[]
}> {
  return request('/locale/get_locale_list', {
    method: 'get',
  })
}

export async function getLocaleMap() {
  return request('/locale/get_locale_map', {
    method: 'get',
  })
}

export async function addLocale(data: AddLocaleParamsType) {
  return request('/locale/add_locale', {
    method: 'post',
    data: data,
  })
}

export async function updateLocale(data: UpdateLocaleParamsType) {
  return request('/locale/update_locale', {
    method: 'post',
    data: data,
  })
}

export async function deleteLocale(key: string) {
  return request('/locale/delete_locale', {
    method: 'post',
    data: { 'zh-CN': key },
  })
}

// 上传 - 分析
export async function uploadAnalyze(data: any) {
  return request('/locale/upload_analyze', {
    method: 'post',
    data: data,
  })
}

// 上传 - 提交
export async function uploadSubmit(data: any) {
  return request('/locale/upload_submit', {
    method: 'post',
    data: data,
  })
}

// 从仓库里面更新翻译的key列表
export async function updateKeyListByLoadSourceCode() {
  return request('/locale/update_key_list_by_load_source_code', {
    method: 'get',
  })
}

// 从仓库里面的语言包json更新翻译的列表
export async function updateListByLoadSourceCodeLocale() {
  return request('/locale/update_list_by_load_source_code_locale', {
    method: 'get',
  })
}
