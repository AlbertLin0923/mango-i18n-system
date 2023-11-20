import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal, Select } from 'antd'

import * as API from '@/services/locale'

export type DownloadLocaleModalProps = React.PropsWithChildren<{
  localeDictWithLabel: any[]
  visible: boolean
  onClose: () => void
}>

const { Option } = Select

const DownloadLocaleModal: FC<DownloadLocaleModalProps> = ({
  localeDictWithLabel,
  visible,
  onClose,
}) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = async () => {
    const values = await form.validateFields()
    const { downloadLocaleFileNameArr } = values
    setSubmitLoading(true)

    const { data } = await API.getLocaleMap()
    const { map } = data
    if (map) {
      downloadLocaleFileNameArr.forEach((val: string) => {
        const item = JSON.stringify(map[val], null, 2)
        const element = document.createElement('a')
        element.setAttribute(
          'href',
          'data:text/json;charset=utf-8,' + encodeURIComponent(item),
        )
        element.download = `${val}.json`
        element.click()
      })
    }
    setSubmitLoading(false)
  }

  return (
    <Modal
      confirmLoading={submitLoading}
      okText={t('下载')}
      open={visible}
      title={t('下载语言包')}
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
          initialValue={localeDictWithLabel.map((i) => i.value)}
          label={t('导出语言包')}
          name="downloadLocaleFileNameArr"
          rules={[
            {
              required: true,
              message: t('请选择导出语言包'),
            },
          ]}
        >
          <Select
            filterOption={(input, option) =>
              (String(option?.children) ?? '')
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            mode="multiple"
            optionFilterProp="children"
            allowClear
            showSearch
          >
            {localeDictWithLabel.map((i) => (
              <Option key={i.value} value={i.value}>
                {`${i.value}.json`}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DownloadLocaleModal
