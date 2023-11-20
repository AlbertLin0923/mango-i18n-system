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

export interface UpdateMyPasswordParamsType {
  oldPassword: string
  password: string
}

export interface UpdateOtherPasswordParamsType {
  userId: string
  password: string
}

export interface AddUserParamsType {
  username: string
  password: string
  email: string
  role: string
}

export interface UpdateUserParamsType {
  userId: string
  username?: string
  password?: string
  email?: string
  role?: string
  account_status?: string
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

export async function getUserList(data: any) {
  return request('/user/get_user_list', {
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

export async function updateOtherPassword(data: UpdateOtherPasswordParamsType) {
  return request('/user/update_other_password', {
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

export async function updateUser(data: UpdateUserParamsType) {
  return request('/user/update_user', {
    method: 'post',
    data,
  })
}

export async function getSearchOptions() {
  return request('/user/get_search_options', {
    method: 'get',
  })
}
