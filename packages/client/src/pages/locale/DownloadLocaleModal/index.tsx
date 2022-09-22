import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Modal, Select } from 'antd'
import * as API from '../../../services/locale'

export type DownloadLocaleModalProps = React.PropsWithChildren<{
  localeDictWithLabel: Array<any>
  visible: boolean
  onClose: () => void
}>

const { Option } = Select

const DownloadLocaleModal: React.FC<DownloadLocaleModalProps> = (props) => {
  const { localeDictWithLabel, visible, onClose } = props
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      const { downloadLocaleFileNameArr } = values
      setSubmitLoading(true)

      const { data } = await API.getLocaleMap()
      const { map } = data
      if (map) {
        downloadLocaleFileNameArr.forEach((val: string) => {
          const item = JSON.stringify(map[val], null, 2)
          const element = document.createElement('a')
          element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(item))
          element.download = `${val}.json`
          element.click()
        })
      }
      setSubmitLoading(false)
    } catch (error) {}
  }

  const selectInitialValue = localeDictWithLabel.map((i) => i.value)

  return (
    <Modal
      title={t('下载语言包')}
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
          name="downloadLocaleFileNameArr"
          label={t('导出语言包')}
          rules={[
            {
              required: true,
              message: t('请选择导出语言包')
            }
          ]}
          initialValue={selectInitialValue}
        >
          <Select
            allowClear
            showSearch
            mode="multiple"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {localeDictWithLabel.map((i) => (
              <Option value={i.value} key={i.value}>
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
