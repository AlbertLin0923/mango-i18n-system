import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  Spin,
  Space,
  Button,
  Popconfirm,
  Card,
  Timeline,
  message,
} from 'antd'
import {
  FileAddOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  CloudDownloadOutlined,
  UnorderedListOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { parseDate } from '@mango-kit/utils'

import Igroup from '@/components/Igroup'
import * as API from '@/services/locale'

import SearchForm from './SearchForm/SearchForm'
import LocaleModal from './LocaleModal/index'
import BatchImportModal from './BatchImportModal/index'
import BatchExportModal from './BatchExportModal/index'
import DownloadLocaleModal from './DownloadLocaleModal/index'
import AnalysisModal from './AnalysisModal/index'
import useDict from './useDict'

import type { SearchOptionsType } from './SearchForm/SearchForm'
import type { ColumnsType } from 'antd/es/table'

const getModuleListFromLocaleList = (list: any[]): any[] => {
  const r = list.reduce((acc, item) => {
    return acc.concat(item.modules.split(','))
  }, [])
  return Array.from(new Set(r)).filter((i) => {
    return i !== ''
  })
}

export interface TableListItem {
  'zh-CN': string
  modules: string
  create_time: Date
  update_time: Date
  [key: string]: string | Date
}

export interface TablePaginationType {
  page: number
  page_size?: number
}

const getFilterTableDataFromTableData = (
  searchOptions: SearchOptionsType,
  list: any[],
) => {
  let _filter: any[] = list
  const { textType, text, modules, filter } = searchOptions

  if (textType && text) {
    _filter = _filter.filter((it) => {
      return it[textType].includes(text.trim())
    })
  }

  if (modules?.length > 0) {
    _filter = _filter.filter((it) => {
      const m = it['modules'].split(',')
      if (Array.isArray(m) && m[0] !== '') {
        if (m.some((i: any) => modules.includes(i))) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })
  }

  if (filter[0]) {
    _filter = _filter.filter(
      (item) => item[filter[1]] === '' || item[filter[1]] === undefined,
    )
  }

  return _filter
}

const Page: FC = () => {
  const { t } = useTranslation()

  const [dict, dictAlready] = useDict()

  const { localeDictWithLabel } = dict

  const [localeModalConfig, setLocaleModalConfig] = useState<{
    visible: boolean
    type: 'add' | 'modify'
    data: any
  }>({
    visible: false,
    type: 'add',
    data: null,
  })

  const [analysisModalConfig, setAnalysisModalConfig] = useState<{
    visible: boolean
  }>({
    visible: false,
  })

  const [batchImportModalConfig, setBatchImportModalConfig] = useState<{
    visible: boolean
  }>({
    visible: false,
  })

  const [batchExportModalConfig, setBatchExportModalConfig] = useState<{
    visible: boolean
  }>({
    visible: false,
  })

  const [downloadLocaleModalConfig, setDownloadLocaleModalConfig] = useState<{
    visible: boolean
  }>({
    visible: false,
  })

  const [tablePagination, setTablePagination] = useState<TablePaginationType>({
    page_size: 5,
    page: 1,
  })

  const [tableData, setTableData] = useState<any[]>([])
  const [filterTableData, setFilterTableData] = useState<any[]>([])
  const [tableLoading, setTableLoading] = useState<boolean>(false)
  const [moduleList, setModuleList] = useState<string[]>([])

  const [searchOptions, setSearchOptions] = useState<SearchOptionsType>({
    textType: '',
    text: '',
    modules: [],
    filter: [false, 'en-US'],
  })

  const [repositoryActionMessages, setRepositoryActionMessages] = useState<
    string[]
  >([])
  const [
    repositoryActionMessagesBoxVisible,
    toggleRepositoryActionMessagesBoxVisible,
  ] = useState<boolean>(false)

  const getLocaleList = async (readKeyListAgain = true) => {
    setTableLoading(true)
    if (readKeyListAgain) {
      const result = await API.updateKeyListByLoadSourceCode()
      if (result?.success) {
        message.success(result?.message?.[result?.message?.length - 1] ?? '', 3)
        setRepositoryActionMessages(() => [...(result?.message ?? '')])
      }
    }
    const { success, data } = await API.getLocaleList()
    setTableLoading(false)
    if (success && data?.list) {
      const { list } = data
      setModuleList(getModuleListFromLocaleList(list))
      setTableData(list)
    }
  }

  useEffect(() => {
    getLocaleList()
  }, [])

  useEffect(() => {
    setFilterTableData(
      getFilterTableDataFromTableData(searchOptions, tableData),
    )
  }, [searchOptions, tableData])

  const handleSearchFormSubmit = async (values: SearchOptionsType) => {
    setSearchOptions(() => ({ ...values }))
    // 重置tablePagination到首页
    setTablePagination((d) => ({ ...d, page: 1 }))
  }

  const deleteLocale = async (key: string) => {
    const { success } = await API.deleteLocale(key)
    if (success) {
      message.success('删除成功')
      getLocaleList(false)
    }
  }

  const updateLocale = async (record: any) => {
    setLocaleModalConfig(() => {
      return { visible: true, type: 'modify', data: record }
    })
  }

  const localeColumns = localeDictWithLabel
    .filter((i) => i.value !== 'zh-CN')
    .map((i) => {
      return {
        title: i.label,
        dataIndex: i.value,
        width: 200,
      }
    })

  const columns: ColumnsType<TableListItem> = [
    {
      title: 'zh-CN (简体中文)',
      dataIndex: 'zh-CN',
      width: 250,
      fixed: 'left',
    },
    ...localeColumns,
    {
      title: '所属模块',
      dataIndex: 'modules',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center',
      width: 160,
      render: (text: Date) => parseDate(text),
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      align: 'center',
      width: 160,
      render: (text: Date) => parseDate(text),
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            loading={
              localeModalConfig.type === 'modify' &&
              localeModalConfig?.data?.['zh-CN'] === record?.['zh-CN'] &&
              localeModalConfig.visible
            }
            size="middle"
            type="primary"
            onClick={() => updateLocale(record)}
          >
            {t('更新')}
          </Button>
          <Popconfirm
            title={t('确定要删除该条翻译么?')}
            onConfirm={() => deleteLocale(record['zh-CN'])}
          >
            <Button size="middle" type="primary" danger>
              {t('删除')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const paginationConfig = {
    current: tablePagination.page,
    pageSize: tablePagination.page_size,
    defaultPageSize: 5,
    total: filterTableData.length,
    pageSizeOptions: ['5', '8', '10', '15', '20', '30', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) =>
      t('共 {{total}} 条翻译信息', { total: total }),
    onChange: (page: number, page_size?: number) => {
      const newTb = { page, page_size }
      setTablePagination(() => ({ ...newTb }))
    },
  }

  return (
    <div className="page-container">
      <Spin spinning={!dictAlready}>
        <Igroup title={t('筛选栏')}>
          <SearchForm
            localeDictWithLabel={localeDictWithLabel}
            moduleList={moduleList}
            onSubmit={handleSearchFormSubmit}
          >
            <Button
              icon={<UnorderedListOutlined />}
              loading={analysisModalConfig.visible}
              type="primary"
              onClick={() => {
                setAnalysisModalConfig(() => ({ visible: true }))
              }}
            >
              {t('查看筛选的语言包数据统计')}
            </Button>

            <Button
              icon={<DownloadOutlined />}
              loading={batchExportModalConfig.visible}
              type="primary"
              onClick={() => {
                setBatchExportModalConfig(() => ({ visible: true }))
              }}
            >
              {t('导出筛选的{{length}}条数据到Excel', {
                length: filterTableData.length,
              })}
            </Button>
          </SearchForm>
        </Igroup>

        <Igroup title={t('工具栏')}>
          <Space style={{ margin: '0 0 20px 0' }}>
            <Button
              icon={<FileAddOutlined />}
              loading={
                localeModalConfig.type === 'add' && localeModalConfig.visible
              }
              type="primary"
              onClick={() =>
                setLocaleModalConfig(() => ({
                  visible: true,
                  type: 'add',
                  data: null,
                }))
              }
            >
              {t('添加翻译')}
            </Button>

            <Button
              icon={<CloudUploadOutlined />}
              loading={batchImportModalConfig.visible}
              type="primary"
              onClick={() => {
                setBatchImportModalConfig(() => ({ visible: true }))
              }}
            >
              {t('批量上传')}
            </Button>

            <Button
              icon={<CloudDownloadOutlined />}
              loading={downloadLocaleModalConfig.visible}
              type="primary"
              onClick={() => {
                setDownloadLocaleModalConfig((v) => ({ ...v, visible: true }))
              }}
            >
              {t('下载语言包')}
            </Button>

            <Button
              icon={<HistoryOutlined />}
              type="primary"
              onClick={() => {
                toggleRepositoryActionMessagesBoxVisible((v) => !v)
              }}
            >
              {repositoryActionMessagesBoxVisible
                ? t('隐藏解析器操作日志')
                : t('显示解析器操作日志')}
            </Button>
          </Space>
          {repositoryActionMessagesBoxVisible ? (
            <Card style={{ marginBottom: '20px' }} title={t('解析器操作日志')}>
              <Timeline mode="left">
                {repositoryActionMessages.map((i) => {
                  return <Timeline.Item key={i}>{i}</Timeline.Item>
                })}
              </Timeline>
            </Card>
          ) : null}
        </Igroup>

        <Table
          columns={columns}
          dataSource={filterTableData}
          loading={tableLoading}
          pagination={{ ...paginationConfig }}
          rowKey={(record: any) => record['zh-CN']}
          scroll={{ x: 1770, scrollToFirstRowOnChange: true }}
          bordered
        />
      </Spin>

      <LocaleModal
        {...localeModalConfig}
        localeDictWithLabel={localeDictWithLabel}
        moduleList={moduleList}
        onClose={() => {
          setLocaleModalConfig(() => ({
            visible: false,
            type: 'add',
            data: null,
          }))
        }}
        onResetTableList={() => {
          getLocaleList(false)
        }}
      />

      <AnalysisModal
        {...analysisModalConfig}
        filterTableData={filterTableData}
        localeDictWithLabel={localeDictWithLabel}
        onClose={() => {
          setAnalysisModalConfig(() => ({ visible: false }))
        }}
      />

      <BatchImportModal
        {...batchImportModalConfig}
        localeDictWithLabel={localeDictWithLabel}
        tableData={tableData}
        onClose={() => {
          setBatchImportModalConfig(() => ({ visible: false }))
        }}
        onResetTableList={() => {
          getLocaleList(false)
        }}
      />

      <BatchExportModal
        {...batchExportModalConfig}
        filterTableData={filterTableData}
        localeDictWithLabel={localeDictWithLabel}
        onClose={() => {
          setBatchExportModalConfig(() => ({ visible: false }))
        }}
      />

      <DownloadLocaleModal
        {...downloadLocaleModalConfig}
        localeDictWithLabel={localeDictWithLabel}
        onClose={() => {
          setDownloadLocaleModalConfig(() => ({ visible: false }))
        }}
      />
    </div>
  )
}

export default Page
