import request from '@/utils/request'

export async function getSearchOptions() {
  return request('/record/get_search_options', {
    method: 'get',
  })
}

export async function getRecordList(data: any) {
  return request('/record/get_record_list', {
    method: 'post',
    data,
  })
}
