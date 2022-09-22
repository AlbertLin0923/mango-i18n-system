import React, { useState } from 'react'
import { Spin, Modal, message, Upload, Table, Button, Alert } from 'antd'

import { UploadProps, RcFile } from 'antd/es/upload'
import { ColumnsType } from 'antd/es/table'

import { useTranslation } from 'react-i18next'

import {
  DownloadOutlined,
  CloudUploadOutlined,
  ContainerOutlined,
  FileAddOutlined
} from '@ant-design/icons'

import { exportExcel } from '@/utils/exportExcel'

import styles from './index.module.less'
import * as API from '../../../services/locale'

import className from 'classnames/bind'
const cx = className.bind(styles)

const { Dragger } = Upload

export const getFileExtendName = (filename: string) => {
  // 文件扩展名匹配正则
  const reg = /\.([^.]+$)/
  const matches = filename.match(reg)
  if (matches) {
    return matches[1]
  }
  return ''
}

export type BatchImportModalProps = React.PropsWithChildren<{
  localeDictWithLabel: Array<any>
  visible: boolean
  tableData: Array<any>
  onClose: () => void
  onResetTableList: () => void
}>

export type UploadConfigType = {
  loading: boolean
  downloadExcelStatus: 'none' | 'success' | 'fail'
  loadExcelStatus: 'none' | 'success' | 'fail'
  analyzeExcelStatus: 'none' | 'success' | 'fail'
  uploadExcelStatus: 'none' | 'success' | 'fail'
  analyzeExcelStat: Array<any>
  analyzeExcelStubStat: Array<any>
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

const BatchImportModal: React.FC<BatchImportModalProps> = (props) => {
  const { t } = useTranslation()

  const { localeDictWithLabel, visible, tableData, onClose, onResetTableList } = props

  const downloadTemplate = () => {
    exportExcel(
      tableData,
      '翻译文案',
      localeDictWithLabel.map((i) => i.value)
    )

    setUploadConfig((v) => ({
      ...v,
      downloadExcelStatus: 'success'
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
    fileData: null
  })

  const uploadProps: UploadProps = {
    name: 'file',
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/json',
    multiple: false,
    showUploadList: false,
    beforeUpload: async (file: RcFile, fileList) => {
      const fileType = getFileExtendName(file.name)

      const legalTypeAndSize: Record<string, number> = {
        xls: 10,
        xlsx: 10,
        json: 10
      }
      const isLegalType = Object.keys(legalTypeAndSize).includes(fileType)

      if (!isLegalType) {
        setUploadConfig((v) => ({ ...v, loadExcelStatus: 'fail' }))
        message.error({
          content: t('文件格式不正确')
        })
        return false
      } else {
        if (file.size > legalTypeAndSize[fileType] * 1024 * 1024) {
          setUploadConfig((v) => ({ ...v, loadExcelStatus: 'fail' }))
          message.error({
            content: t('文件大小超出限制')
          })
          return false
        } else {
          const formData = new FormData()
          formData.append('file', file)
          setUploadConfig((v) => ({ ...v, loading: true, loadExcelStatus: 'success' }))

          try {
            let res = await API.uploadAnalyze(formData)
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
                fileData: file
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
                fileData: null
              }))
            }
          } finally {
            return false
          }
        }
      }
    }
  }

  const columns: ColumnsType<StatColumnType> = [
    {
      title: '语言包',
      dataIndex: 'locale',
      width: 230,
      fixed: 'left'
    },
    {
      title: '新增数量',
      dataIndex: 'addNumber',
      align: 'center'
    },
    {
      title: '修改数量',
      dataIndex: 'modifyNumber',
      align: 'center'
    },
    {
      title: '删除数量',
      dataIndex: 'deleteNumber',
      align: 'center'
    },
    {
      title: '相同数量',
      dataIndex: 'sameNumber',
      align: 'center'
    }
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
        fileData: null
      }))

      onResetTableList()
    }
  }

  const renderDownloadStepView = () => {
    return (
      <div className={styles['step-content']}>
        <div className={styles['step-line']}></div>
        <div className={styles['step-label']}>
          <DownloadOutlined
            className={cx('step-icon', {
              none: uploadConfig.downloadExcelStatus === 'none',
              success: uploadConfig.downloadExcelStatus === 'success',
              fail: uploadConfig.downloadExcelStatus === 'fail'
            })}
          />
          <span>{t('下载模板')}</span>
        </div>
        <div className={styles['step-value']}>
          <p className={styles['download-link']} onClick={downloadTemplate}>
            翻译.xlsx
          </p>
          <div className={styles['tips']}>
            <p>{t('导入规则')} :</p>
            <p>1. {t('文件支持xls/xlsx/json格式')}</p>
            <p>2. {t('需按模板上传文件，字段类型需符合规范')}</p>
            <p>3. {t('字段的 modules 属性需要单个进行配置,批量上传默认不支持该属性变更')}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderLoadStepView = () => {
    return (
      <div className={styles['step-content']}>
        <div className={styles['step-line']}></div>
        <div className={styles['step-label']}>
          <FileAddOutlined
            className={cx('step-icon', {
              none: uploadConfig.loadExcelStatus === 'none',
              success: uploadConfig.loadExcelStatus === 'success',
              fail: uploadConfig.loadExcelStatus === 'fail'
            })}
          />
          <span>
            {t(
              { none: '加载文件', success: '加载文件成功', fail: '加载文件失败' }[
                uploadConfig.loadExcelStatus
              ]
            )}
          </span>
        </div>
        <div className={styles['step-value']}>
          <div className={styles['upload-box']}>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                {t('将文件拖到此处')} {t('或')} <span>{t('点击上传')}</span>
              </p>
            </Dragger>
          </div>
        </div>
      </div>
    )
  }

  const renderAnalyzeStepView = () => {
    return (
      <div className={styles['step-content']}>
        <div className={styles['step-line']}></div>
        <div className={styles['step-label']}>
          <ContainerOutlined
            className={cx('step-icon', {
              none: uploadConfig.analyzeExcelStatus === 'none',
              success: uploadConfig.analyzeExcelStatus === 'success',
              fail: uploadConfig.analyzeExcelStatus === 'fail'
            })}
          />
          <span className={styles['text']}>
            {t(
              { none: '分析文件', success: '分析文件成功', fail: '分析文件失败' }[
                uploadConfig.analyzeExcelStatus
              ]
            )}
          </span>
        </div>
        <div className={styles['step-value']}>
          {uploadConfig.analyzeExcelStatus !== 'none' ? (
            uploadConfig.analyzeExcelStatus === 'success' ? (
              <div>
                {uploadConfig?.analyzeExcelStubStat?.length > 0 ? (
                  <div style={{ margin: '10px 0px' }}>
                    <Alert
                      message={
                        <div className={styles['alert-wrapper']}>
                          <div className={styles['alert-content']}>
                            注意:
                            系统检测到部分词条中含有占位符，翻译时，无须翻译占位符内容，保持原样即可
                          </div>
                          <div className={styles['alert-content']}>
                            例如: 中文词条:{' '}
                            <span
                              style={{
                                padding: '5px 10px',
                                border: '1px solid #fff',
                                backgroundColor: '#108ee9',
                                color: '#fff',
                                marginRight: '5px',
                                borderRadius: '5px'
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
                                borderRadius: '5px'
                              }}
                            >
                              Hello,{'{{name}}'}
                            </span>
                          </div>
                          <div className={styles['alert-content']}>
                            <span
                              style={{
                                padding: '5px 10px',
                                border: '1px solid #fff',
                                backgroundColor: '#ff4d4f',
                                color: '#fff',
                                marginRight: '5px',
                                borderRadius: '5px'
                              }}
                            >
                              以下词条可能翻译有误，请检查修改后再提交 ：
                            </span>
                          </div>
                          <div className={cx('error-locale-box')}>
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
                                  lineHeight: 2
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
                  bordered
                  pagination={false}
                  rowKey={(record) => record['locale']}
                  columns={columns}
                  dataSource={uploadConfig.analyzeExcelStat}
                />
              </div>
            ) : uploadConfig.analyzeExcelStatus === 'fail' ? (
              <div className={styles['step-value']}>
                <div className={cx('step-value-text', 'fail')}>{uploadConfig.errorMsg}</div>
              </div>
            ) : null
          ) : (
            <Table
              bordered
              pagination={false}
              rowKey={(record) => record['locale']}
              columns={columns}
              dataSource={[]}
            />
          )}
        </div>
      </div>
    )
  }

  const renderUploadStepView = () => {
    return (
      <div className={styles['step-content']}>
        <div className={styles['step-line']}></div>
        <div className={styles['step-label']}>
          <CloudUploadOutlined
            className={cx('step-icon', {
              none: uploadConfig.uploadExcelStatus === 'none',
              success: uploadConfig.uploadExcelStatus === 'success',
              fail: uploadConfig.uploadExcelStatus === 'fail'
            })}
          />
          <span className={styles['text']}>
            {t(
              { none: '上传文件', success: '上传文件成功', fail: '上传文件失败' }[
                uploadConfig.uploadExcelStatus
              ]
            )}
          </span>
        </div>
        <div className={styles['step-value']}>
          {uploadConfig.uploadExcelStatus !== 'none' ? (
            uploadConfig.uploadExcelStatus === 'success' ? (
              <div className={styles['step-value']}>
                <div className={cx('step-value-text', 'success')}>{t('上传文件成功')}</div>
              </div>
            ) : uploadConfig.uploadExcelStatus === 'fail' ? (
              <div className={styles['step-value']}>
                <div className={cx('step-value-text', 'fail')}>{uploadConfig.errorMsg}</div>
              </div>
            ) : null
          ) : (
            <div className={styles['upload-submit']}>
              <Button
                disabled={!(uploadConfig.analyzeExcelStatus === 'success')}
                style={{ width: '100%' }}
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={handleSubmit}
              >
                {t('确认上传')}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Modal
      width="1000px"
      title={t('批量导入字段')}
      visible={visible}
      footer={null}
      maskClosable={false}
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
          fileData: null
        }))
        onClose()
      }}
    >
      <Spin spinning={uploadConfig.loading}>
        <div className={styles['step-content-wrapper']}>
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
