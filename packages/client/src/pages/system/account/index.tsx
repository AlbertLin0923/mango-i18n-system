import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Space, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { MangoProTable } from '@mango-kit/components'

import * as API from '@/services/user'
import { statusMap } from '@/dict/user'

import AddUserModal from './AddUserModal'
import ResetUserPasswordModal from './ResetUserPasswordModal'

import type { MangoProTableHandle } from '@mango-kit/components'

const Page: FC = () => {
  const { t } = useTranslation()

  const proTableRef = useRef<MangoProTableHandle>(null)

  const [addUserModalConfig, setAddUserModalConfig] = useState<{
    open: boolean
  }>({
    open: false,
  })

  const [resetUserPasswordModalConfig, setResetUserPasswordModalConfig] =
    useState<{
      open: boolean
      data: any
    }>({
      open: false,
      data: {},
    })

  const toggleStatus = async (record: any, val: boolean) => {
    console.log('record, val', record, val)

    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: val ? t('账户解冻确认') : t('账户冻结确认'),
        icon: <ExclamationCircleOutlined />,
        content: val
          ? t('请确认是否解冻该账户？')
          : t('请确认是否冻结该账户？'),
        async onOk() {
          resolve('true')
          const delivery = {
            userId: record.userId,
            account_status: val ? 'normal' : 'freeze',
          }
          API.updateUser(delivery)
            .then((res) => {
              if (res.success) {
                message.success(t('操作成功'))
                proTableRef?.current?.refresh()
              } else {
                message.error(res.err_msg)
              }
            })
            .finally(() => {
              resolve('true')
            })
        },
        onCancel() {
          message.info({
            content: t('已取消'),
          })
          reject('false')
        },
      })
    })
  }
  return (
    <>
      <MangoProTable
        columnActions={{
          width: 120,
          showAliasConfig: {
            key: 'status',
            map: statusMap,
          },
          list: [
            {
              title: '重置密码',
              action: (record: any, navigate: any) => {
                setResetUserPasswordModalConfig(() => {
                  return { open: true, data: record }
                })
              },
            },
            {
              title: '冻结',
              action: (record: any, navigate: any) => {
                toggleStatus(record, record?.account_status)
              },
              show: ['正常'],
            },
            {
              title: '解冻',
              action: (record: any, navigate: any) => {
                toggleStatus(record, record?.account_status)
              },
              show: ['冻结'],
            },
          ],
        }}
        columns={[
          {
            title: t('序号'),
            dataIndex: 'index',
            width: 50,
            render: (text, record, index) => index + 1,
          },
          {
            title: t('用户名'),
            dataIndex: 'username',
            width: 150,
            ellipsis: true,
          },
          {
            title: t('邮箱'),
            dataIndex: 'email',
            width: 150,
            ellipsis: true,
          },
          {
            title: t('角色'),
            dataIndex: 'role',
            width: 150,
            valueType: 'map',
            valueEnum: 'roleMap',
          },
          {
            title: t('创建人'),
            dataIndex: 'creator',
            width: 150,
            render: (text, record, index) => text,
          },
          {
            title: t('创建时间'),
            dataIndex: 'create_time',
            width: 150,
            valueType: 'dateTime',
          },
          {
            title: t('账户状态'),
            dataIndex: 'account_status',
            width: 150,
            valueType: 'status',
            valueEnum: statusMap,
          },
        ]}
        pageTips={{
          type: 'info',
          message: <div>{t('可在该列表查询系统的用户列表')}</div>,
          showIcon: true,
          closable: true,
        }}
        pageType="table"
        ref={proTableRef}
        request={{
          getSearchOptions: {
            api: API.getSearchOptions,
          },
          getList: {
            api: API.getUserList,
          },
        }}
        rowKey="id"
        searchFormConfigList={[
          [
            {
              name: 'username',
              label: t('用户名'),
              type: 'input',
              maxLength: 100,
              initialValue: undefined,
              placeholder: t('请输入用户名'),
            },
            {
              name: 'email',
              label: t('邮箱'),
              type: 'input',
              maxLength: 100,
              initialValue: undefined,
              placeholder: t('请选择邮箱'),
            },
            {
              name: 'role',
              label: t('角色'),
              type: 'select',
              initialValue: undefined,
              placeholder: t('请选择角色'),
              optionFilter: (data: any) => {
                return data?.roleMap
              },
            },
          ],
          [
            {
              name: 'account_status',
              label: t('账户状态'),
              type: 'select',
              initialValue: undefined,
              placeholder: t('请选择账户状态'),
              optionFilter: (data: any) => {
                return data?.accountStatusMap
              },
            },
            {
              name: 'creator',
              label: t('创建人'),
              type: 'input',
              maxLength: 100,
              initialValue: undefined,
              placeholder: t('请输入创建人'),
            },
            {
              name: 'create_time',
              label: t('创建时间'),
              type: 'date-range-picker',
              picker: 'date',
              initialValue: undefined,
            },
          ],
        ]}
        toolBarRender={() => {
          return (
            <Space>
              <Button
                type="primary"
                onClick={() => setAddUserModalConfig(() => ({ open: true }))}
              >
                {t('新增用户')}
              </Button>
            </Space>
          )
        }}
      />

      <AddUserModal
        {...addUserModalConfig}
        onClose={() => setAddUserModalConfig(() => ({ open: false }))}
        onResetTableList={() => proTableRef?.current?.refresh()}
      />

      <ResetUserPasswordModal
        {...resetUserPasswordModalConfig}
        onClose={() =>
          setResetUserPasswordModalConfig(() => ({ open: false, data: {} }))
        }
        onResetTableList={() => proTableRef?.current?.refresh()}
      />
    </>
  )
}

export default Page
