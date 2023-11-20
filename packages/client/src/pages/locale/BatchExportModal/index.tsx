import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal, Input } from 'antd'

import { exportExcel } from '@/utils/exportExcel'

export type BatchExportModalProps = PropsWithChildren<{
  localeDictWithLabel: any[]
  visible: boolean
  filterTableData: any[]
  onClose: () => void
}>

const BatchExportModal: FC<BatchExportModalProps> = ({
  localeDictWithLabel,
  visible,
  filterTableData,
  onClose,
}) => {
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
        localeDictWithLabel.map((i) => i.value),
      )
      setSubmitLoading(false)
    })
  }

  return (
    <Modal
      confirmLoading={submitLoading}
      okText={t('下载')}
      open={visible}
      title={t('导出语言包')}
      width="50vw"
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      onOk={() => {
        handleFormSubmit()
      }}
    >
      <Form autoComplete="off" form={form} layout="vertical">
        <Form.Item
          initialValue={t('翻译文案')}
          label={t('导出文件名')}
          name="exportFileName"
          rules={[
            {
              required: true,
              message: '请输入导出文件名',
            },
          ]}
        >
          <Input placeholder="请输入导出文件名" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BatchExportModal
