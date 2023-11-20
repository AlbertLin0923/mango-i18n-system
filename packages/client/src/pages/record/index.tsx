import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'
import ReactJson from 'react-json-view'
import { MangoProTable } from '@mango-kit/components'

import * as API from '@/services/record'

import type { MangoProTableHandle } from '@mango-kit/components'

const convertJson = (jsonStr: string) => {
  try {
    return JSON.parse(jsonStr)
  } catch (error) {
    return {}
  }
}

const Page: FC = () => {
  const { t } = useTranslation()

  const proTableRef = useRef<MangoProTableHandle>(null)

  return (
    <>
      <MangoProTable
        columns={[
          {
            title: t('文案字段'),
            dataIndex: 'operate_field',
            width: 150,
            copyable: true,
          },
          {
            title: t('操作类型'),
            dataIndex: 'operate_type',
            width: 150,
            ellipsis: true,
          },
          {
            title: t('操作方式'),
            dataIndex: 'operate_way',
            width: 150,
            ellipsis: true,
          },
          {
            title: t('操作前内容'),
            dataIndex: 'previous_content',
            width: 200,
            ellipsis: true,
            render: (text, row) => {
              return (
                <ReactJson
                  displayDataTypes={false}
                  src={convertJson(text)}
                  collapsed
                />
              )
            },
          },
          {
            title: t('操作后内容'),
            dataIndex: 'current_content',
            width: 200,
            ellipsis: true,
            render: (text, record) => {
              return (
                <ReactJson
                  displayDataTypes={false}
                  src={convertJson(text)}
                  collapsed
                />
              )
            },
          },
          {
            title: t('操作人'),
            dataIndex: 'operator_name',
            width: 120,
            ellipsis: true,
          },
          {
            title: t('操作IP地址'),
            dataIndex: 'operator_ip_address',
            width: 120,
            ellipsis: true,
            render: (text: string) => {
              return <Tag color="purple">{text}</Tag>
            },
          },
          {
            title: t('操作时间'),
            dataIndex: 'update_time',
            width: 150,
            valueType: 'date',
          },
        ]}
        pageTips={{
          type: 'info',
          message: <div>{t('可在该列表查询文案字段的变更记录')}</div>,
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
            api: API.getRecordList,
          },
        }}
        rowKey="id"
        searchFormConfigList={[
          [
            {
              name: 'operate_field',
              label: t('操作字段'),
              type: 'input',
              maxLength: 500,
              initialValue: undefined,
              placeholder: t('请输入操作字段'),
            },
            {
              name: 'operate_way',
              label: t('操作方式'),
              type: 'select',
              initialValue: undefined,
              placeholder: t('请选择操作方式'),
              optionFilter: (data: any) => {
                return data?.operateWayMap
              },
            },
            {
              name: 'operate_type',
              label: t('操作类型'),
              type: 'select',
              initialValue: undefined,
              placeholder: t('请选择服务类型'),
              optionFilter: (data: any) => {
                return data?.operateTypeMap
              },
            },
          ],
          [
            {
              name: 'operator_name',
              label: t('操作人'),
              type: 'select',
              initialValue: undefined,
              placeholder: t('请选择操作人'),
              optionFilter: (data: any) => {
                return data?.operatorNameMap
              },
            },
            {
              name: 'update_time',
              label: t('操作时间'),
              type: 'date-range-picker',
              picker: 'date',
              initialValue: undefined,
            },
          ],
        ]}
      />
    </>
  )
}

export default Page
