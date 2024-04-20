import { useState } from 'react'
import { Spin, Modal, App, Upload, Table, Button, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  DownloadOutlined,
  CloudUploadOutlined,
  ContainerOutlined,
  FileAddOutlined,
} from '@ant-design/icons'
import cx from 'classnames'
import { getFileExtName } from '@mango-kit/utils'

import { exportExcel } from '@/utils/exportExcel'
import * as API from '@/services/locale'

import type { ColumnsType } from 'antd/es/table'
import type { UploadProps, RcFile } from 'antd/es/upload'

const { Dragger } = Upload

export type BatchImportModalProps = PropsWithChildren<{
  localeDictWithLabel: any[]
  open: boolean
  tableData: any[]
  onClose: () => void
  onResetTableList: () => void
}>

export type UploadConfigType = {
  loading: boolean
  downloadExcelStatus: 'none' | 'success' | 'fail'
  loadExcelStatus: 'none' | 'success' | 'fail'
  analyzeExcelStatus: 'none' | 'success' | 'fail'
  uploadExcelStatus: 'none' | 'success' | 'fail'
  analyzeExcelStat: any[]
  analyzeExcelStubStat: any[]
  errorMsg: string
  fileData: RcFile | null
}

export type StatColumnType = {
  locale: string
  addNumber: number
  modifyNumber: number
  deleteNumber: number
  sameNumber: number
}

const StepView: FC<{
  icon: ReactNode
  title: string
  content: ReactNode
}> = ({ icon, title, content }) => {
  return (
    <div className="relative mb-4 flex items-start">
      <div className="absolute left-3 top-3 h-full w-[1px] bg-zinc-300" />
      <div className="mr-8 flex flex-none items-center break-words">
        <div className="z-10 mr-1 bg-white text-2xl">{icon}</div>
        <span>{title}</span>
      </div>
      <div className="flex-auto">{content}</div>
    </div>
  )
}

const BatchImportModal: FC<BatchImportModalProps> = ({
  localeDictWithLabel,
  open,
  tableData,
  onClose,
  onResetTableList,
}) => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const downloadTemplate = () => {
    exportExcel(
      tableData,
      '翻译文案',
      localeDictWithLabel.map((i) => i.value),
    )

    setUploadConfig((v) => ({
      ...v,
      downloadExcelStatus: 'success',
    }))
  }

  const [uploadConfig, setUploadConfig] = useState<UploadConfigType>({
    loading: false,
    downloadExcelStatus: 'none',
    loadExcelStatus: 'none',
    analyzeExcelStatus: 'none',
    uploadExcelStatus: 'none',
    analyzeExcelStat: [],
    analyzeExcelStubStat: [],
    errorMsg: '',
    fileData: null,
  })

  const uploadProps: UploadProps = {
    name: 'file',
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/json',
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file: RcFile, fileList) => {
      const fileType = getFileExtName(file.name)

      const legalTypeAndSize: Record<string, number> = {
        xls: 10,
        xlsx: 10,
        json: 10,
      }
      const isLegalType = Object.keys(legalTypeAndSize).includes(fileType)

      if (!isLegalType) {
        setUploadConfig((v) => ({ ...v, loadExcelStatus: 'fail' }))
        message.error({
          content: t('文件格式不正确'),
        })
        return false
      } else {
        if (file.size > legalTypeAndSize[fileType] * 1024 * 1024) {
          setUploadConfig((v) => ({ ...v, loadExcelStatus: 'fail' }))
          message.error({
            content: t('文件大小超出限制'),
          })
          return false
        } else {
          const formData = new FormData()
          formData.append('file', file)
          setUploadConfig((v) => ({
            ...v,
            loading: true,
            loadExcelStatus: 'success',
          }))

          const res = await API.uploadAnalyze(formData)
          if (res.success) {
            const _stat = res?.data?.stat ?? {}
            const _result = res?.data?.result ?? []
            const r = Object.entries(_stat).map(([key, value]) => {
              return { locale: key, ...(value as Record<string, number>) }
            })
            setUploadConfig((v) => ({
              ...v,
              loading: false,
              downloadExcelStatus: 'success',
              loadExcelStatus: 'success',
              analyzeExcelStatus: 'success',
              uploadExcelStatus: 'none',
              analyzeExcelStat: r,
              analyzeExcelStubStat: _result,
              errorMsg: '',
              fileData: file,
            }))
          } else {
            setUploadConfig((v) => ({
              ...v,
              loading: false,
              downloadExcelStatus: 'success',
              loadExcelStatus: 'success',
              analyzeExcelStatus: 'fail',
              uploadExcelStatus: 'none',
              analyzeExcelStat: [],
              analyzeExcelStubStat: [],
              errorMsg: res.err_msg,
              fileData: null,
            }))
          }
        }
      }
    },
  }

  const columns: ColumnsType<StatColumnType> = [
    {
      title: '文案',
      dataIndex: 'locale',
      width: 230,
      fixed: 'left',
    },
    {
      title: '新增数量',
      dataIndex: 'addNumber',
      align: 'center',
    },
    {
      title: '修改数量',
      dataIndex: 'modifyNumber',
      align: 'center',
    },
    {
      title: '删除数量',
      dataIndex: 'deleteNumber',
      align: 'center',
    },
    {
      title: '相同数量',
      dataIndex: 'sameNumber',
      align: 'center',
    },
  ]

  const handleSubmit = async () => {
    setUploadConfig((v) => ({ ...v, loading: true }))
    const formData = new FormData()
    formData.append('file', uploadConfig.fileData as RcFile)
    const res = await API.uploadSubmit(formData)
    if (res.success) {
      setUploadConfig((v) => ({
        ...v,
        loading: false,
        uploadExcelStatus: 'success',
        fileData: null,
      }))

      onResetTableList()
    }
  }

  const renderDownloadStepView = () => {
    return (
      <StepView
        content={
          <div className="w-full">
            <Button
              className="pl-0 underline"
              type="link"
              onClick={downloadTemplate}
            >
              翻译.xlsx
            </Button>
            <div className="mt-4">
              <p>{t('导入规则')} :</p>
              <p>1. {t('文件支持xls/xlsx/json格式')}</p>
              <p>2. {t('需按模板上传文件，字段类型需符合规范')}</p>
              <p>
                3.
                {t(
                  '字段的 modules 属性需要单个进行配置,批量上传默认不支持该属性变更',
                )}
              </p>
            </div>
          </div>
        }
        icon={
          <DownloadOutlined
            className={cx({
              'text-primary': uploadConfig.downloadExcelStatus === 'none',
              'text-green-500': uploadConfig.downloadExcelStatus === 'success',
              'text-red-500': uploadConfig.downloadExcelStatus === 'fail',
            })}
          />
        }
        title={t('下载模板')}
      />
    )
  }

  const renderLoadStepView = () => {
    return (
      <StepView
        content={
          <div className="w-full">
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                {t('将文件拖到此处')} {t('或')} <span>{t('点击上传')}</span>
              </p>
            </Dragger>
          </div>
        }
        icon={
          <FileAddOutlined
            className={cx({
              'text-primary': uploadConfig.loadExcelStatus === 'none',
              'text-green-500': uploadConfig.loadExcelStatus === 'success',
              'text-red-500': uploadConfig.loadExcelStatus === 'fail',
            })}
          />
        }
        title={t(
          {
            none: '加载文件',
            success: '加载文件成功',
            fail: '加载文件失败',
          }[uploadConfig.loadExcelStatus],
        )}
      />
    )
  }

  const renderAnalyzeStepView = () => {
    return (
      <StepView
        content={
          <div>
            {uploadConfig.analyzeExcelStatus !== 'none' ? (
              uploadConfig.analyzeExcelStatus === 'success' ? (
                <div>
                  {uploadConfig?.analyzeExcelStubStat?.length > 0 ? (
                    <div className="my-2">
                      <Alert
                        message={
                          <div className="px-6 py-3">
                            <div className="h-10 leading-loose">
                              注意:
                              系统检测到部分词条中含有占位符，翻译时，无须翻译占位符内容，保持原样即可
                            </div>
                            <div className="h-10 leading-loose">
                              例如: 中文词条:{' '}
                              <span
                                style={{
                                  padding: '5px 10px',
                                  border: '1px solid #fff',
                                  backgroundColor: '#108ee9',
                                  color: '#fff',
                                  marginRight: '5px',
                                  borderRadius: '5px',
                                }}
                              >
                                你好，{'{{name}}'}
                              </span>
                              只需翻译为 :
                              <span
                                style={{
                                  padding: '5px 10px',
                                  border: '1px solid #fff',
                                  backgroundColor: '#108ee9',
                                  color: '#fff',
                                  marginRight: '5px',
                                  borderRadius: '5px',
                                }}
                              >
                                Hello,{'{{name}}'}
                              </span>
                            </div>
                            <div className="h-10 leading-loose">
                              <span
                                style={{
                                  padding: '5px 10px',
                                  border: '1px solid #fff',
                                  backgroundColor: '#ff4d4f',
                                  color: '#fff',
                                  marginRight: '5px',
                                  borderRadius: '5px',
                                }}
                              >
                                以下词条可能翻译有误，请检查修改后再提交 ：
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center">
                              {uploadConfig?.analyzeExcelStubStat.map((i) => (
                                <span
                                  key={i.key}
                                  style={{
                                    padding: '5px 10px',
                                    border: '1px solid #fff',
                                    backgroundColor: '#5ed534',
                                    color: '#fff',
                                    margin: '2px 5px 2px 0',
                                    borderRadius: '6px',
                                    lineHeight: 2,
                                  }}
                                >
                                  {i.key}
                                </span>
                              ))}
                            </div>
                          </div>
                        }
                        type="error"
                        showIcon
                      />
                    </div>
                  ) : null}
                  <Table
                    columns={columns}
                    dataSource={uploadConfig.analyzeExcelStat}
                    pagination={false}
                    rowKey={(record) => record['locale']}
                    bordered
                  />
                </div>
              ) : uploadConfig.analyzeExcelStatus === 'fail' ? (
                <div className="text-lg text-red-500">
                  {uploadConfig.errorMsg}
                </div>
              ) : null
            ) : (
              <Table
                columns={columns}
                dataSource={[]}
                pagination={false}
                rowKey={(record) => record['locale']}
                bordered
              />
            )}
          </div>
        }
        icon={
          <ContainerOutlined
            className={cx({
              'text-primary': uploadConfig.analyzeExcelStatus === 'none',
              'text-green-500': uploadConfig.analyzeExcelStatus === 'success',
              'text-red-500': uploadConfig.analyzeExcelStatus === 'fail',
            })}
          />
        }
        title={t(
          {
            none: '分析文件',
            success: '分析文件成功',
            fail: '分析文件失败',
          }[uploadConfig.analyzeExcelStatus],
        )}
      />
    )
  }

  const renderUploadStepView = () => {
    return (
      <StepView
        content={
          <div>
            {uploadConfig.uploadExcelStatus !== 'none' ? (
              uploadConfig.uploadExcelStatus === 'success' ? (
                <div className="text-lg text-green-500">
                  {t('上传文件成功')}
                </div>
              ) : uploadConfig.uploadExcelStatus === 'fail' ? (
                <div className="text-lg text-red-500">
                  {uploadConfig.errorMsg}
                </div>
              ) : null
            ) : (
              <div className="mb-4 flex w-full items-center justify-end">
                <Button
                  disabled={!(uploadConfig.analyzeExcelStatus === 'success')}
                  icon={<CloudUploadOutlined />}
                  type="primary"
                  block
                  onClick={handleSubmit}
                >
                  {t('确认上传')}
                </Button>
              </div>
            )}
          </div>
        }
        icon={
          <CloudUploadOutlined
            className={cx({
              'text-primary': uploadConfig.uploadExcelStatus === 'none',
              'text-green-500': uploadConfig.uploadExcelStatus === 'success',
              'text-red-500': uploadConfig.uploadExcelStatus === 'fail',
            })}
          />
        }
        title={t(
          {
            none: '上传文件',
            success: '上传文件成功',
            fail: '上传文件失败',
          }[uploadConfig.uploadExcelStatus],
        )}
      />
    )
  }

  return (
    <Modal
      footer={null}
      maskClosable={false}
      open={open}
      title={t('批量导入字段')}
      width="1000px"
      centered
      onCancel={() => {
        setUploadConfig(() => ({
          loading: false,
          loadExcelStatus: 'none',
          downloadExcelStatus: 'none',
          analyzeExcelStatus: 'none',
          uploadExcelStatus: 'none',
          analyzeExcelStat: [],
          analyzeExcelStubStat: [],
          errorMsg: '',
          fileData: null,
        }))
        onClose()
      }}
    >
      <Spin spinning={uploadConfig.loading}>
        <div>
          {renderDownloadStepView()}
          {renderLoadStepView()}
          {renderAnalyzeStepView()}
          {renderUploadStepView()}
        </div>
      </Spin>
    </Modal>
  )
}

export default BatchImportModal
