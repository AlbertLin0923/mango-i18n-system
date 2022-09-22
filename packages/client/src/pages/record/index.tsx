import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Moment } from 'moment'

import ReactJson from 'react-json-view'

import SearchForm, { SearchOptionsType, SearchFormValueType } from './SearchForm/SearchForm'
import { parseDateString } from '../../utils/index'

import * as API from '../../services/record'

const convertJson = (jsonStr: string) => {
  try {
    return JSON.parse(jsonStr)
  } catch (error) {
    return {}
  }
}

export type TableListItem = {
  id: string
  operate_way: string
  operate_type: string
  operate_time: [Moment, Moment]
  operator_name: string
  operate_field: string
  previous_content: string
  current_content: string
}

export interface TablePaginationType {
  page: number
  pageSize?: number
}

const Record: React.FC<{}> = () => {
  const { t } = useTranslation()

  const [searchOptions, setSearchOptions] = useState<SearchOptionsType>({
    already: false,
    operateWayMap: [],
    operateTypeMap: [],
    operatorNameMap: []
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

  const [searchFormValue, setSearchFormValue] = useState<SearchFormValueType>({
    operate_way: '',
    operate_type: '',
    operate_time: undefined,
    operator_name: '',
    operate_field: ''
  })

  const handleSearchFormSubmit = (values: SearchFormValueType) => {
    const newSearchFormValue = { ...values }
    setSearchFormValue(() => ({ ...newSearchFormValue }))
    // 重置tablePagination到首页
    const newTb = { ...tablePagination, ...{ page: 1 } }
    setTablePagination(() => ({ ...newTb }))
    getRecordList(newSearchFormValue, newTb)
  }

  const getSearchOptions = async () => {
    setTableLoading(true)

    const { data } = await API.getSearchOptions()
    if (data) {
      setSearchOptions(() => ({ ...data, already: true }))
    }
  }

  const getRecordList = async (
    searchFormValue: SearchFormValueType,
    tablePagination: TablePaginationType
  ) => {
    setTableLoading(true)
    const delivery: Record<string, any> = {}
    Object.entries({ ...searchFormValue, ...tablePagination }).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (key === 'operate_time') {
          delivery[key] = [
            (value as Array<Moment>)[0].utc().valueOf(),
            (value as Array<Moment>)[1].utc().valueOf()
          ]
        } else if (key === 'operate_field') {
          delivery[key] = (value as string).trim()
        } else {
          delivery[key] = value
        }
      }
    })

    console.log('delivery', delivery)

    const { data } = await API.getRecordList(delivery)
    if (data?.list) {
      const { list, total } = data
      setTableData(() => ({ list, total }))
      setTableLoading(false)
    }
  }

  useEffect(() => {
    getSearchOptions()
  }, [])

  useEffect(() => {
    searchOptions.already && getRecordList(searchFormValue, tablePagination)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOptions])

  const columns: ColumnsType<TableListItem> = [
    {
      title: t('字段'),
      dataIndex: 'operate_field',
      key: 'operate_field',
      fixed: 'left',
      ellipsis: true
    },
    {
      title: t('操作类型'),
      dataIndex: 'operate_type',
      key: 'operate_type',
      ellipsis: true
    },
    {
      title: t('操作方式'),
      dataIndex: 'operate_way',
      key: 'operate_way',
      ellipsis: true
    },
    {
      title: t('操作前内容'),
      dataIndex: 'previous_content',
      key: 'previous_content',
      width: 320,
      ellipsis: true,
      render: (text, row) => {
        return <ReactJson collapsed displayDataTypes={false} src={convertJson(text)} />
      }
    },
    {
      title: t('操作后内容'),
      dataIndex: 'current_content',
      key: 'current_content',
      width: 320,
      ellipsis: true,
      render: (text, row) => {
        return <ReactJson collapsed displayDataTypes={false} src={convertJson(text)} />
      }
    },
    {
      title: t('操作人'),
      dataIndex: 'operator_name',
      key: 'operator_name',
      ellipsis: true
    },
    {
      title: t('操作IP地址'),
      dataIndex: 'operator_ip_address',
      key: 'operator_ip_address',
      ellipsis: true,
      render: (text: string) => {
        return <Tag color="purple">{text}</Tag>
      }
    },
    {
      title: t('操作时间'),
      dataIndex: 'update_time',
      key: 'update_time',
      width: 160,
      ellipsis: true,
      render: (text: Moment) => parseDateString(text)
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
      getRecordList(searchFormValue, newTb)
    }
  }

  return (
    <div>
      {searchOptions.already && (
        <SearchForm searchOptions={searchOptions} onSubmit={handleSearchFormSubmit}></SearchForm>
      )}
      <Table
        style={{ width: '100%' }}
        bordered
        pagination={{ ...paginationConfig }}
        rowKey={(row) => row['id']}
        loading={tableLoading}
        columns={columns}
        dataSource={tableData.list}
      />
    </div>
  )
}

export default Record
