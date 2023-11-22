import { RoleType, AccountStatusType } from './user.entity.js'

export const roleMap: { label: string; value: RoleType }[] = [
  {
    label: '普通用户',
    value: 'user',
  },
  {
    label: '管理员',
    value: 'admin',
  },
]

export const accountStatusMap: {
  label: string
  value: AccountStatusType
}[] = [
  {
    label: '账户正常',
    value: 'normal',
  },
  {
    label: '账户冻结',
    value: 'freeze',
  },
]
