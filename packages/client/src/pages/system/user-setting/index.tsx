import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Table, Tag, Button, Space, Modal, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Moment } from 'moment'

import { ExclamationCircleOutlined } from '@ant-design/icons'

import LoadableSwitch from '@/components/LoadableSwitch'

import SearchForm, { SearchFormValueType } from './SearchForm/SearchForm'
import AddUserModal from './AddUserModal'
import ResetUserPasswordModal from './ResetUserPasswordModal'
import { parseDateString } from '../../../utils/index'

import * as API from '../../../services/user'

export type SearchOptionsType = {
  already: boolean
  roleMap: Array<{ label: string; value: string }>
  accountStatusMap: Array<{ label: string; value: string }>
}

export type TableListItem = {
  userId: string
  username: string
  email: string
  role: string
  account_status: string
  create_time: [Moment, Moment]
  creator: string
}

export interface TablePaginationType {
  page: number
  pageSize?: number
}

const UserSetting: React.FC<{}> = () => {
  const { t } = useTranslation()

  const [searchOptions, setSearchOptions] = useState<SearchOptionsType>({
    already: false,
    roleMap: [],
    accountStatusMap: []
  })

  const [searchFormValue, setSearchFormValue] = useState<SearchFormValueType>({
    username: '',
    email: '',
    role: '',
    account_status: '',
    create_time: undefined,
    creator: ''
  })

  const [tablePagination, setTablePagination] = useState<TablePaginationType>({
    pageSize: 5,
    page: 1
  })

  const [tableData, setTableData] = useState<{
    list: Array<any>
    total: number
  }>({
    list: [],
    total: 0
  })
  const [tableLoading, setTableLoading] = useState<boolean>(false)

  const [addUserModalConfig, setAddUserModalConfig] = useState<{
    visible: boolean
  }>({
    visible: false
  })

  const [resetUserPasswordModalConfig, setResetUserPasswordModalConfig] = useState<{
    visible: boolean
    data: any
  }>({
    visible: false,
    data: {}
  })

  const handleSearchFormSubmit = (values: SearchFormValueType) => {
    const newSearchFormValue = { ...values }
    setSearchFormValue(() => ({ ...newSearchFormValue }))
    // 重置tablePagination到首页
    const newTb = { ...tablePagination, ...{ page: 1 } }
    setTablePagination(() => ({ ...newTb }))
    getUserList(newSearchFormValue, newTb)
  }

  const getSearchOptions = async () => {
    setTableLoading(true)

    const { data } = await API.getSearchOptions()
    if (data) {
      setSearchOptions(() => ({ ...data, already: true }))
    }
  }

  const getUserList = async (
    searchFormValue: SearchFormValueType,
    tablePagination: TablePaginationType
  ) => {
    setTableLoading(true)
    const delivery: Record<string, any> = {}
    Object.entries({ ...searchFormValue, ...tablePagination }).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'create_time') {
          delivery[key] = [
            (value as Array<Moment>)[0].utc().valueOf(),
            (value as Array<Moment>)[1].utc().valueOf()
          ]
        } else if (['username', 'email', 'creator'].includes(key)) {
          delivery[key] = (value as string).trim()
        } else {
          delivery[key] = value
        }
      }
    })

    console.log('delivery', delivery)

    const { data } = await API.getUserList(delivery)
    if (data?.list) {
      const { list, total } = data
      setTableData(() => ({ list, total }))
      setTableLoading(false)
    }
  }

  const toggleStatus = async (record: any, val: boolean, event: MouseEvent) => {
    console.log('record, val', record, val)

    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: val ? t('账户解冻确认') : t('账户冻结确认'),
        icon: <ExclamationCircleOutlined />,
        content: val ? t('请确认是否解冻该账户？') : t('请确认是否冻结该账户？'),
        async onOk() {
          resolve('true')
          const delivery = {
            userId: record.userId,
            account_status: val ? 'normal' : 'freeze'
          }
          API.updateUser(delivery)
            .then((res) => {
              if (res.success) {
                message.success(t('操作成功'))
                getUserList(searchFormValue, tablePagination)
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
            content: t('已取消')
          })
          reject('false')
        }
      })
    })
  }

  useEffect(() => {
    getSearchOptions()
  }, [])

  useEffect(() => {
    searchOptions.already && getUserList(searchFormValue, tablePagination)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions])

  const columns: ColumnsType<TableListItem> = [
    {
      title: t('序号'),
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1
    },
    {
      title: t('用户名'),
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: t('邮箱'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: t('角色'),
      dataIndex: 'role',
      render: (text, record, index) =>
        searchOptions?.roleMap?.find((v) => {
          return v.value === text
        })?.label
    },
    {
      title: t('账户状态'),
      dataIndex: 'account_status',
      key: 'role',
      render: (text, record, index) => {
        const label =
          searchOptions?.accountStatusMap?.find((v) => {
            return v.value === text
          })?.label ?? ''
        if (text === 'normal') {
          return <Tag color="success">{t(label)}</Tag>
        } else {
          return <Tag color="error">{t(label)}</Tag>
        }
      }
    },
    {
      title: t('创建人'),
      dataIndex: 'creator',
      key: 'creator',
      render: (text, record, index) => text
    },
    {
      title: t('创建时间'),
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: Moment) => parseDateString(text)
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 400,
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            size="middle"
            type="link"
            loading={
              resetUserPasswordModalConfig?.data?.userId === record?.userId &&
              resetUserPasswordModalConfig.visible
            }
            onClick={() => {
              setResetUserPasswordModalConfig(() => {
                return { visible: true, data: record }
              })
            }}
          >
            {t('重置密码')}
          </Button>
          <LoadableSwitch
            checkedChildren={t('账户正常')}
            unCheckedChildren={t('账户冻结')}
            checked={record.account_status === 'normal'}
            onChange={(val, event) => toggleStatus(record, val, event)}
          />
        </Space>
      )
    }
  ]

  const paginationConfig = {
    current: tablePagination.page,
    pageSize: tablePagination.pageSize,
    defaultPageSize: 5,
    total: tableData.total,
    pageSizeOptions: ['5', '8', '10', '15', '20', '30', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) => t('共 {{total}} 条数据', { total: total }),
    onChange: (page: number, pageSize?: number) => {
      const newTb = { page, pageSize }
      setTablePagination(() => ({ ...newTb }))
      getUserList(searchFormValue, newTb)
    }
  }

  return (
    <div>
      {searchOptions.already && (
        <SearchForm searchOptions={searchOptions} onSubmit={handleSearchFormSubmit}>
          <Button type="primary" onClick={() => setAddUserModalConfig(() => ({ visible: true }))}>
            {t('新增用户')}
          </Button>
        </SearchForm>
      )}

      <Table
        style={{ width: '100%' }}
        bordered
        pagination={{ ...paginationConfig }}
        rowKey={(row) => row['userId']}
        loading={tableLoading}
        columns={columns}
        dataSource={tableData.list}
      />

      <AddUserModal
        {...addUserModalConfig}
        searchOptions={searchOptions}
        onResetTableList={() => getUserList(searchFormValue, tablePagination)}
        onClose={() => setAddUserModalConfig(() => ({ visible: false }))}
      ></AddUserModal>

      <ResetUserPasswordModal
        {...resetUserPasswordModalConfig}
        onResetTableList={() => getUserList(searchFormValue, tablePagination)}
        onClose={() => setResetUserPasswordModalConfig(() => ({ visible: false, data: {} }))}
      ></ResetUserPasswordModal>
    </div>
  )
}

export default UserSetting
