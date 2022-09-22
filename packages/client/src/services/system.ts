import request from '@/utils/request'

export type UpdateSettingParamsType = {
  setting: {
    [key: string]: string | string[]
  }
}

export async function getPublicSetting() {
  return request('/setting/get_public_setting', {
    method: 'get'
  })
}

export async function getSearchOptions() {
  return request('/setting/get_search_options', {
    method: 'get'
  })
}

// 获取系统设置信息
export async function getSetting() {
  return request('/setting/get_setting', {
    method: 'get'
  })
}

// 更新系统设置信息
export async function updateSetting(data: UpdateSettingParamsType) {
  return request('/setting/update_setting', {
    method: 'post',
    data: data
  })
}
