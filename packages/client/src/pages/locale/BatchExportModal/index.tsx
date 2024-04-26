import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal, Input } from 'antd'

import { exportExcel } from '@/utils/exportExcel'

const BatchExportModal: FC<{
  localeDictWithLabel: { label: string; value: string }[]
  open: boolean
  filterTableData: any[]
  onClose: () => void
}> = ({ localeDictWithLabel, open, filterTableData, onClose }) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)
      exportExcel(
        filterTableData,
        values.exportFileName.trim(),
        localeDictWithLabel.map((i) => i.value),
      )
      setSubmitLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      confirmLoading={submitLoading}
      maskClosable={false}
      okText={t('下载')}
      open={open}
      title={t('导出语言包')}
      width="50vw"
      onCancel={() => {
        form.resetFields()
        onClose()
      }}
      onOk={handleFormSubmit}
    >
      <Form autoComplete="off" form={form} layout="horizontal">
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
