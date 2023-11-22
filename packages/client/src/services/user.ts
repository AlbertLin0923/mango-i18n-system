import request from '@/utils/request'

export type LoginParamsType = {
  username: string
  password: string
}

export type RegisterParamsType = {
  username: string
  password: string
  email: string
  invitationCode: string
}

export type UpdateMyUserInfoParamsType = Partial<{
  email: string
}>

export type UpdateMyPasswordParamsType = {
  oldPassword: string
  password: string
}

export type AddUserParamsType = {
  username: string
  password: string
  email: string
  role: string
}

export type UpdateOtherUserInfoParamsType = {
  userId: string
  email?: string
  role?: string
  account_status?: string
}

export type UpdateOtherPasswordParamsType = {
  userId: string
  password: string
}

export async function login(data: LoginParamsType) {
  return request('/user/login', {
    method: 'post',
    data,
  })
}

export async function register(data: RegisterParamsType) {
  return request('/user/register', {
    method: 'post',
    data,
  })
}

export async function getUserInfo() {
  return request('/user/get_user_info/', {
    method: 'get',
  })
}

export async function updateMyUserInfo(data: UpdateMyUserInfoParamsType) {
  return request('/user/update_my_user_info', {
    method: 'post',
    data,
  })
}

export async function updateMyPassword(data: UpdateMyPasswordParamsType) {
  return request('/user/update_my_password', {
    method: 'post',
    data,
  })
}

// ----------------------------------------------------------------

export async function getSearchOptions() {
  return request('/user/get_search_options', {
    method: 'get',
  })
}

export async function getUserList(data: any) {
  return request('/user/get_user_list', {
    method: 'post',
    data,
  })
}

export async function addUser(data: AddUserParamsType) {
  return request('/user/add_user', {
    method: 'post',
    data,
  })
}

export async function updateOtherUserInfo(data: UpdateOtherUserInfoParamsType) {
  return request('/user/update_other_user_info', {
    method: 'post',
    data,
  })
}

export async function updateOtherPassword(data: UpdateOtherPasswordParamsType) {
  return request('/user/update_other_password', {
    method: 'post',
    data,
  })
}
