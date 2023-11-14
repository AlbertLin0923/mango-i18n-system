// 与 正则 相关的工具函数
const isExternal = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

const isPhone = (string: string): boolean => {
  return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(string)
}

const isPassword = (string: string): boolean => {
  return /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,20}$/.test(string)
}

const isPasswordStrongly = (
  string: string,
): 'success' | 'normal' | 'exception' => {
  if (/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).{8,20}$/.test(string)) {
    return 'success'
  } else if (
    /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,20}$/.test(string)
  ) {
    return 'normal'
  } else {
    return 'exception'
  }
}

const isEmail = (string: string): boolean => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    string,
  )
}

const MangoRegExp = {
  isExternal,
  isPhone,
  isPassword,
  isPasswordStrongly,
  isEmail,
}

export default MangoRegExp
