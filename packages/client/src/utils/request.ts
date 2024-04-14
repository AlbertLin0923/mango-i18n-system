/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request'

import i18n from '@/locales'
import { history } from '@/router'
import { useUserStore } from '@/store'
import { modal, notification } from '@/app'

import type { ResponseError } from 'umi-request'

type ModalInstance = {
  _handleNoLoginInstance: any
  _handleLoginOverdueInstance: any
}

const modalInstance: ModalInstance = {
  _handleNoLoginInstance: null,
  _handleLoginOverdueInstance: null,
}

export const handleLoginOverdue = async () => {
  if (modalInstance._handleNoLoginInstance) {
    return
  } else {
    // to re-login
    modalInstance._handleLoginOverdueInstance = modal.error({
      zIndex: 9999, // 防止被其他弹窗或者其他元素覆盖，优先级最高
      title: i18n.t('登录失效,请重新登录'),
      centered: true,
      closable: false,
      keyboard: false,
      okText: i18n.t('重新登录'),
      onOk: () => {
        modalInstance._handleLoginOverdueInstance = null
        useUserStore.getState().logout()
        const redirect = encodeURIComponent(window.location.href)

        history.replace({
          pathname: '/user/login',
          search: `?redirect=${redirect}`,
        })
      },
    })
  }
}

type CodeMessage = Record<number, string>

const codeMessage: CodeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}
/**
 * 异常处理程序
 */

const errorHandler = (error: ResponseError) => {
  const { response } = error

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText
    const { status, url } = response
    if (status === 401) {
      handleLoginOverdue()
      return response
    } else {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      })
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    })
  }

  return response
}
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  prefix: '/api',
  errorHandler,
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 1000 * 60 * 2,
})

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  const { accessToken } = useUserStore.getState().tokenPair
  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  }
})

/**
 * response拦截器处理
 */
request.interceptors.response.use(async (response) => {
  // 克隆响应对象做解析处理
  if (response.status === 200) {
    const res = await response.clone().json()
    const { success, msg, errMsg, code } = res
    if (!success) {
      console.log('error', msg || errMsg)
      notification.error({
        message: '请求错误',
        description: `${code}: ${msg || errMsg}`,
      })
    }
    return res
  }
  return response
})

export default request
