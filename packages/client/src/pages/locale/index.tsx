import { useMemo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  Spin,
  Space,
  Button,
  Popconfirm,
  Card,
  Timeline,
  App,
  Typography,
  Form,
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
import { useRequest } from 'ahooks'

import MangoCard from '@/components/MangoCard/index'
import * as API from '@/services/locale'

import SearchForm from './SearchForm/index'
import LocaleModal from './LocaleModal/index'
import BatchImportModal from './BatchImportModal/index'
import BatchExportModal from './BatchExportModal/index'
import DownloadLocaleModal from './DownloadLocaleModal/index'
import AnalysisModal from './AnalysisModal/index'

import type { SearchOptionsType } from './SearchForm'
import type { ColumnsType } from 'antd/es/table'
import type { Locale } from '@/services/locale'

// 从 文案列表 获取 模块名字列表
const getModuleListFromLocaleList = (list: any[]): any[] =>
  Array.from(
    new Set(
      list.reduce((acc, item) => acc.concat(item.modules.split(',')), []),
    ),
  ).filter((i) => i !== '')

export type TableListItem = {
  'zh-CN': string
  modules: string
  create_time: Date
  update_time: Date
  [key: string]: string | Date
}

const filterTableDataFromTableData = (
  searchOptions: SearchOptionsType,
  list: Locale[],
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
        return m.some((i: any) => modules.includes(i))
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
  const { message } = App.useApp()

  const { data: localeDictWithLabel = [], loading: getDictLoading } =
    useRequest<{ label: string; value: string }[], never>(
      async () => await API.getDict().then((res) => res?.data ?? []),
    )

  const localeColumns = useMemo(() => {
    return (
      localeDictWithLabel
        ?.filter(({ value }) => value !== 'zh-CN')
        ?.map(({ label, value }) => ({
          title: label,
          dataIndex: value,
          width: 200,
        })) ?? []
    )
  }, [localeDictWithLabel])

  const [localeModalConfig, setLocaleModalConfig] = useState<{
    open: boolean
    type: 'add' | 'modify'
    data: any
  }>({
    open: false,
    type: 'add',
    data: null,
  })

  const [analysisModalConfig, setAnalysisModalConfig] = useState<{
    open: boolean
  }>({
    open: false,
  })

  const [batchImportModalConfig, setBatchImportModalConfig] = useState<{
    open: boolean
  }>({
    open: false,
  })

  const [batchExportModalConfig, setBatchExportModalConfig] = useState<{
    open: boolean
  }>({
    open: false,
  })

  const [downloadLocaleModalConfig, setDownloadLocaleModalConfig] = useState<{
    open: boolean
  }>({
    open: false,
  })

  const [tablePagination, setTablePagination] = useState<TablePaginationType>({
    pageSize: 5,
    page: 1,
  })

  const [tableData, setTableData] = useState<Locale[]>([])
  const [filterTableData, setFilterTableData] = useState<any[]>([])
  const [moduleList, setModuleList] = useState<string[]>([])

  const [searchOptions, setSearchOptions] = useState<SearchOptionsType>({
    textType: '',
    text: '',
    modules: [],
    filter: [false, 'en-US'],
  })

  const [
    repositoryActionMessagesBoxVisible,
    toggleRepositoryActionMessagesBoxVisible,
  ] = useState<boolean>(false)

  const { data: repositoryActionMessages = [] } = useRequest<string[], never>(
    async () => {
      return API.updateKeyListByLoadSourceCode().then(
        (res) => res?.message ?? [],
      )
    },
    {
      onSuccess: (msg) => {
        message.success(msg?.[msg?.length - 1] ?? '', 3)
      },
    },
  )

  const { loading: getLocaleListLoading, run: getLocaleList } = useRequest<
    Locale[],
    never[]
  >(
    async () => {
      return API.getLocaleList().then((res) => {
        return res?.data?.list ?? []
      })
    },
    {
      onSuccess: (list) => {
        setModuleList(getModuleListFromLocaleList(list))
        setTableData(list)
      },
    },
  )

  useEffect(() => {
    setFilterTableData(filterTableDataFromTableData(searchOptions, tableData))
  }, [searchOptions, tableData])

  const handleSearchFormSubmit = async (values: SearchOptionsType) => {
    setSearchOptions(() => ({ ...values }))
    setTablePagination((d) => ({ ...d, page: 1 }))
  }

  const deleteLocale = async (key: string) => {
    const { success } = await API.deleteLocale(key)
    if (success) {
      message.success('删除成功')
      getLocaleList()
    }
  }

  const updateLocale = async (record: any) => {
    setLocaleModalConfig(() => ({ open: true, type: 'modify', data: record }))
  }

  const columns: ColumnsType<TableListItem> = [
    {
      title: 'zh-CN (简体中文)',
      dataIndex: 'zh-CN',
      width: 250,
      fixed: 'left',
      render: (text) => (
        <Typography.Text copyable={true} ellipsis={{ tooltip: text }}>
          {text}
        </Typography.Text>
      ),
    },
    ...localeColumns,
    {
      title: '所属模块',
      dataIndex: 'modules',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 200,
      render: (text: Date) => parseDate(text),
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      width: 200,
      render: (text: Date) => parseDate(text),
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 200,
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            size="middle"
            type="primary"
            onClick={() => updateLocale(record)}
          >
            {t('更新')}
          </Button>
          <Popconfirm
            title={t('确定要删除这条文案吗?')}
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
    pageSize: tablePagination.pageSize,
    defaultPageSize: 5,
    total: filterTableData.length,
    pageSizeOptions: ['5', '8', '10', '15', '20', '30', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) => t('共 {{total}} 条', { total: total }),
    onChange: (page: number, pageSize?: number) => {
      const newTb = { page, pageSize }
      setTablePagination(() => ({ ...newTb }))
    },
  }

  return (
    <>
      <div className="page-container">
        <Spin spinning={getDictLoading}>
          <MangoCard title={t('筛选栏')}>
            <SearchForm
              localeDictWithLabel={localeDictWithLabel}
              moduleList={moduleList}
              onSubmit={handleSearchFormSubmit}
            >
              <Form.Item>
                <Button
                  icon={<UnorderedListOutlined />}
                  type="primary"
                  onClick={() => {
                    setAnalysisModalConfig(() => ({ open: true }))
                  }}
                >
                  {t('查看筛选的语言包数据统计')}
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  icon={<DownloadOutlined />}
                  type="primary"
                  onClick={() => {
                    setBatchExportModalConfig(() => ({ open: true }))
                  }}
                >
                  {t('导出筛选的 {{length}} 条文案到Excel', {
                    length: filterTableData.length,
                  })}
                </Button>
              </Form.Item>
            </SearchForm>
          </MangoCard>
        </Spin>

        <MangoCard title={t('工具栏')}>
          <Space className="mb-6" size="middle">
            <Button
              icon={<FileAddOutlined />}
              type="primary"
              onClick={() =>
                setLocaleModalConfig(() => ({
                  open: true,
                  type: 'add',
                  data: null,
                }))
              }
            >
              {t('添加文案')}
            </Button>

            <Button
              icon={<CloudUploadOutlined />}
              type="primary"
              onClick={() => {
                setBatchImportModalConfig(() => ({ open: true }))
              }}
            >
              {t('批量上传')}
            </Button>

            <Button
              icon={<CloudDownloadOutlined />}
              type="primary"
              onClick={() => {
                setDownloadLocaleModalConfig((v) => ({ ...v, open: true }))
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
              <Timeline
                items={repositoryActionMessages?.map((i) => ({ children: i }))}
                mode="left"
              />
            </Card>
          ) : null}
        </MangoCard>

        <MangoCard border={false} className="flex-auto">
          <Table
            className="w-full"
            columns={columns}
            dataSource={filterTableData}
            loading={getLocaleListLoading}
            pagination={{ ...paginationConfig }}
            rowKey={(record) => record['zh-CN']}
            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
            bordered
          />
        </MangoCard>
      </div>

      <LocaleModal
        {...localeModalConfig}
        localeDictWithLabel={localeDictWithLabel}
        moduleList={moduleList}
        onClose={() => {
          setLocaleModalConfig(() => ({
            open: false,
            type: 'add',
            data: null,
          }))
        }}
        onResetTableList={getLocaleList}
      />

      <AnalysisModal
        {...analysisModalConfig}
        filterTableData={filterTableData}
        localeDictWithLabel={localeDictWithLabel}
        onClose={() => {
          setAnalysisModalConfig(() => ({ open: false }))
        }}
      />

      <BatchImportModal
        {...batchImportModalConfig}
        localeDictWithLabel={localeDictWithLabel}
        tableData={tableData}
        onClose={() => {
          setBatchImportModalConfig(() => ({ open: false }))
        }}
        onResetTableList={getLocaleList}
      />

      <BatchExportModal
        {...batchExportModalConfig}
        filterTableData={filterTableData}
        localeDictWithLabel={localeDictWithLabel}
        onClose={() => {
          setBatchExportModalConfig(() => ({ open: false }))
        }}
      />

      <DownloadLocaleModal
        {...downloadLocaleModalConfig}
        localeDictWithLabel={localeDictWithLabel}
        onClose={() => {
          setDownloadLocaleModalConfig(() => ({ open: false }))
        }}
      />
    </>
  )
}

export default Page
