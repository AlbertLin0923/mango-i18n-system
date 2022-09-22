import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { Form, Modal, Input } from 'antd'

import { exportExcel } from '../../../utils/exportExcel'

export type BatchExportModalProps = React.PropsWithChildren<{
  localeDictWithLabel: Array<any>
  visible: boolean
  filterTableData: Array<any>
  onClose: () => void
}>

const BatchExportModal: React.FC<BatchExportModalProps> = (props) => {
  const { localeDictWithLabel, visible, filterTableData, onClose } = props
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      setSubmitLoading(true)
      const exportFileName = values.exportFileName.trim()
      exportExcel(
        filterTableData,
        exportFileName,
        localeDictWithLabel.map((i) => i.value)
      )
      setSubmitLoading(false)
    })
  }

  return (
    <Modal
      title={t('导出语言包')}
      width="50vw"
      visible={visible}
      onOk={() => {
        handleFormSubmit()
      }}
      okText={t('下载')}
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      confirmLoading={submitLoading}
    >
      <Form layout="vertical" autoComplete="off" form={form}>
        <Form.Item
          name="exportFileName"
          label={t('导出文件名')}
          rules={[
            {
              required: true,
              message: '请输入导出文件名'
            }
          ]}
          initialValue={t('翻译文案')}
        >
          <Input placeholder="请输入导出文件名" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BatchExportModal
